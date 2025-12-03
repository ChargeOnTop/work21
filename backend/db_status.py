"""
Script to view WORK21 database status
Supports both PostgreSQL and SQLite
"""
import sys
from pathlib import Path

# Добавляем корневую директорию проекта в путь
sys.path.insert(0, str(Path(__file__).resolve().parent))

from sqlalchemy import text, inspect
from app.core.database import engine, Base
from app.core.config import settings
from app.models import User, Project, Application, Rating, Contract


def get_table_names():
    """Получить список таблиц в базе данных"""
    inspector = inspect(engine)
    return inspector.get_table_names()


def get_table_count(table_name: str) -> int:
    """Получить количество записей в таблице"""
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
        return result.scalar()


def main():
    print("=" * 50)
    print("DATABASE STATUS - WORK21")
    print("=" * 50)
    print(f"\nDatabase URL: {settings.database_url.split('@')[-1] if '@' in settings.database_url else settings.database_url}")
    
    try:
        # Получаем список таблиц
        tables = get_table_names()
        
        if not tables:
            print("\n⚠️  No tables found in database")
            print("   Run migrations: alembic upgrade head")
            return
        
        # Tables
        print("\nTABLES:")
        for table in tables:
            try:
                count = get_table_count(table)
                print(f"   - {table}: {count} records")
            except Exception as e:
                print(f"   - {table}: error ({e})")
        
        # Users
        print("\nUSERS:")
        try:
            with engine.connect() as conn:
                result = conn.execute(text("""
                    SELECT id, email, first_name, last_name, role, rating_score, completed_projects 
                    FROM users
                    ORDER BY id
                """))
                users = result.fetchall()
                if users:
                    for u in users:
                        print(f"   [{u[0]}] {u[2]} {u[3]} ({u[4]})")
                        print(f"       Email: {u[1]}")
                        print(f"       Rating: {u[5]}, Projects: {u[6]}")
                else:
                    print("   (no users)")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Projects
        print("\nPROJECTS:")
        try:
            with engine.connect() as conn:
                result = conn.execute(text("""
                    SELECT id, title, status, budget, customer_id 
                    FROM projects
                    ORDER BY id
                """))
                projects = result.fetchall()
                if projects:
                    for p in projects:
                        print(f"   [{p[0]}] {p[1]}")
                        print(f"       Status: {p[2]}, Budget: {p[3]}, Customer: {p[4]}")
                else:
                    print("   (no projects)")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Applications
        print("\nAPPLICATIONS:")
        try:
            app_count = get_table_count("applications")
            print(f"   Total: {app_count}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Ratings
        print("\nRATINGS:")
        try:
            rating_count = get_table_count("ratings")
            print(f"   Total: {rating_count}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Contracts
        print("\nCONTRACTS:")
        try:
            contract_count = get_table_count("contracts")
            print(f"   Total: {contract_count}")
        except Exception as e:
            print(f"   Error: {e}")
        
    except Exception as e:
        print(f"\n❌ Error connecting to database: {e}")
        print("\nMake sure:")
        print("   1. PostgreSQL is running")
        print("   2. Database 'work21' exists")
        print("   3. Credentials are correct in .env or config.py")
        print("   4. Run migrations: alembic upgrade head")
    
    print("\n" + "=" * 50)


if __name__ == "__main__":
    main()

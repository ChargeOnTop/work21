"""
Script to view WORK21 database status
"""
import sqlite3

def main():
    conn = sqlite3.connect('work21.db')
    cursor = conn.cursor()
    
    print("=" * 50)
    print("DATABASE STATUS - WORK21")
    print("=" * 50)
    
    # Tables
    print("\nTABLES:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    for t in cursor.fetchall():
        cursor.execute(f"SELECT COUNT(*) FROM {t[0]}")
        count = cursor.fetchone()[0]
        print(f"   - {t[0]}: {count} records")
    
    # Users
    print("\nUSERS:")
    cursor.execute("""
        SELECT id, email, first_name, last_name, role, rating_score, completed_projects 
        FROM users
    """)
    users = cursor.fetchall()
    if users:
        for u in users:
            print(f"   [{u[0]}] {u[2]} {u[3]} ({u[4]})")
            print(f"       Email: {u[1]}")
            print(f"       Rating: {u[5]}, Projects: {u[6]}")
    else:
        print("   (no users)")
    
    # Projects
    print("\nPROJECTS:")
    cursor.execute("""
        SELECT id, title, status, budget, customer_id 
        FROM projects
    """)
    projects = cursor.fetchall()
    if projects:
        for p in projects:
            print(f"   [{p[0]}] {p[1]}")
            print(f"       Status: {p[2]}, Budget: {p[3]}")
    else:
        print("   (no projects)")
    
    # Applications
    print("\nAPPLICATIONS:")
    cursor.execute("SELECT COUNT(*) FROM applications")
    app_count = cursor.fetchone()[0]
    print(f"   Total: {app_count}")
    
    # Ratings
    print("\nRATINGS:")
    cursor.execute("SELECT COUNT(*) FROM ratings")
    rating_count = cursor.fetchone()[0]
    print(f"   Total: {rating_count}")
    
    print("\n" + "=" * 50)
    conn.close()

if __name__ == "__main__":
    main()


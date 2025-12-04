"""
Скрипт для заполнения базы данных тестовыми данными
"""
import asyncio
import json
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.project import Project, Task, Application, ProjectStatus, TaskStatus, ApplicationStatus
from app.models.rating import Rating


async def create_test_data():
    async with async_session_maker() as session:
        # Проверяем, есть ли уже данные
        result = await session.execute(select(User))
        existing_users = result.scalars().all()
        if existing_users:
            print("База данных уже содержит данные. Пропускаем заполнение.")
            return

        print("Создание тестовых данных...")

        # Создаем заказчиков
        customers = []
        customer_data = [
            {
                "email": "customer1@example.com",
                "first_name": "Алексей",
                "last_name": "Петров",
                "bio": "Опытный предприниматель, работаю в IT-сфере более 10 лет. Ищу талантливых разработчиков для реализации интересных проектов.",
                "skills": None,
            },
            {
                "email": "customer2@example.com",
                "first_name": "Мария",
                "last_name": "Сидорова",
                "bio": "Основатель стартапа в области EdTech. Создаю образовательные платформы для студентов.",
                "skills": None,
            },
            {
                "email": "customer3@example.com",
                "first_name": "Дмитрий",
                "last_name": "Иванов",
                "bio": "Руководитель отдела разработки в крупной компании. Постоянно ищу новых талантов.",
                "skills": None,
            },
        ]

        for data in customer_data:
            customer = User(
                email=data["email"],
                hashed_password=get_password_hash("password123"),
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=UserRole.CUSTOMER,
                bio=data["bio"],
                skills=data["skills"],
                rating_score=0.0,
                completed_projects=0,
                is_active=True,
                is_verified=True,
            )
            session.add(customer)
            customers.append(customer)

        # Создаем студентов
        students = []
        student_data = [
            {
                "email": "student1@example.com",
                "first_name": "Иван",
                "last_name": "Козлов",
                "bio": "Full-stack разработчик с опытом работы с React, Node.js и PostgreSQL. Увлекаюсь созданием современных веб-приложений.",
                "skills": json.dumps(["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"]),
                "rating_score": 4.8,
                "completed_projects": 5,
            },
            {
                "email": "student2@example.com",
                "first_name": "Анна",
                "last_name": "Морозова",
                "bio": "Backend разработчик, специализируюсь на Python и FastAPI. Имею опыт работы с микросервисной архитектурой.",
                "skills": json.dumps(["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"]),
                "rating_score": 4.6,
                "completed_projects": 3,
            },
            {
                "email": "student3@example.com",
                "first_name": "Сергей",
                "last_name": "Волков",
                "bio": "Mobile разработчик с опытом создания iOS и Android приложений. Работаю с React Native и нативными технологиями.",
                "skills": json.dumps(["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"]),
                "rating_score": 4.9,
                "completed_projects": 7,
            },
            {
                "email": "student4@example.com",
                "first_name": "Елена",
                "last_name": "Новикова",
                "bio": "Frontend разработчик, специализируюсь на создании пользовательских интерфейсов. Работаю с современными фреймворками.",
                "skills": json.dumps(["Vue.js", "TypeScript", "Tailwind CSS", "Webpack", "Jest"]),
                "rating_score": 4.7,
                "completed_projects": 4,
            },
            {
                "email": "student5@example.com",
                "first_name": "Павел",
                "last_name": "Соколов",
                "bio": "DevOps инженер с опытом настройки CI/CD, контейнеризации и облачных решений.",
                "skills": json.dumps(["Docker", "Kubernetes", "AWS", "Terraform", "Ansible", "GitLab CI"]),
                "rating_score": 4.5,
                "completed_projects": 2,
            },
            {
                "email": "student6@example.com",
                "first_name": "Ольга",
                "last_name": "Лебедева",
                "bio": "Data Engineer, работаю с большими данными и аналитикой. Опыт с Apache Spark и Airflow.",
                "skills": json.dumps(["Python", "Apache Spark", "Airflow", "PostgreSQL", "MongoDB", "Pandas"]),
                "rating_score": 4.4,
                "completed_projects": 1,
            },
        ]

        for data in student_data:
            student = User(
                email=data["email"],
                hashed_password=get_password_hash("password123"),
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=UserRole.STUDENT,
                bio=data["bio"],
                skills=data["skills"],
                rating_score=data["rating_score"],
                completed_projects=data["completed_projects"],
                is_active=True,
                is_verified=True,
            )
            session.add(student)
            students.append(student)

        await session.commit()
        print(f"Создано {len(customers)} заказчиков и {len(students)} студентов")

        # Создаем проекты
        projects = []
        project_data = [
            {
                "customer": customers[0],
                "title": "Разработка веб-приложения для управления задачами",
                "description": "Необходимо создать современное веб-приложение для управления задачами команды. Приложение должно поддерживать создание проектов, задач, назначение исполнителей, отслеживание прогресса. Требуется интеграция с системами уведомлений.",
                "requirements": "React на фронтенде, Node.js на бэкенде, PostgreSQL для базы данных. Должна быть реализована система аутентификации и авторизации. Необходима адаптивная верстка для мобильных устройств.",
                "budget": 200000,
                "deadline": datetime.utcnow() + timedelta(days=60),
                "tech_stack": json.dumps(["React", "Node.js", "PostgreSQL", "TypeScript"]),
                "status": ProjectStatus.OPEN,
                "llm_estimation": "Оценка времени выполнения: 6-8 недель. Проект включает разработку фронтенда (3 недели), бэкенда (3 недели), интеграцию и тестирование (2 недели).",
            },
            {
                "customer": customers[0],
                "title": "Мобильное приложение для доставки еды",
                "description": "Разработка кроссплатформенного мобильного приложения для заказа и доставки еды. Приложение должно включать каталог ресторанов, корзину, систему оплаты, отслеживание заказа в реальном времени.",
                "requirements": "React Native для кроссплатформенной разработки, интеграция с платежными системами, push-уведомления, карты для отслеживания доставки.",
                "budget": 350000,
                "deadline": datetime.utcnow() + timedelta(days=90),
                "tech_stack": json.dumps(["React Native", "Firebase", "Stripe", "Google Maps API"]),
                "status": ProjectStatus.IN_PROGRESS,
                "assignee": students[2],
                "llm_estimation": "Оценка времени выполнения: 10-12 недель. Включает разработку UI/UX (2 недели), интеграцию с API (3 недели), платежные системы (2 недели), тестирование (2 недели), деплой (1 неделя).",
            },
            {
                "customer": customers[1],
                "title": "Платформа для онлайн-обучения",
                "description": "Создание платформы для проведения онлайн-курсов с возможностью видеолекций, тестов, домашних заданий и отслеживания прогресса студентов.",
                "requirements": "Современный стек: Vue.js, Python FastAPI, PostgreSQL. Необходима интеграция с видеохостингами, система оценки работ, аналитика для преподавателей.",
                "budget": 450000,
                "deadline": datetime.utcnow() + timedelta(days=120),
                "tech_stack": json.dumps(["Vue.js", "Python", "FastAPI", "PostgreSQL", "Redis"]),
                "status": ProjectStatus.REVIEW,
                "assignee": students[1],
                "llm_estimation": "Оценка времени выполнения: 14-16 недель. Разработка включает фронтенд (4 недели), бэкенд (5 недель), интеграцию с видео (2 недели), тестирование (3 недели), деплой (2 недели).",
            },
            {
                "customer": customers[1],
                "title": "Система аналитики для бизнеса",
                "description": "Разработка системы для сбора, обработки и визуализации бизнес-данных. Система должна поддерживать различные источники данных, создание дашбордов и отчетов.",
                "requirements": "Python для обработки данных, веб-интерфейс на React, база данных для хранения метрик. Необходима интеграция с популярными CRM и ERP системами.",
                "budget": 300000,
                "deadline": datetime.utcnow() + timedelta(days=75),
                "tech_stack": json.dumps(["Python", "React", "PostgreSQL", "Apache Spark", "D3.js"]),
                "status": ProjectStatus.OPEN,
                "llm_estimation": "Оценка времени выполнения: 9-11 недель. Включает разработку ETL процессов (3 недели), веб-интерфейса (3 недели), визуализации (2 недели), интеграции (2 недели), тестирование (1 неделя).",
            },
            {
                "customer": customers[2],
                "title": "API для интеграции с внешними сервисами",
                "description": "Создание RESTful API для интеграции корпоративной системы с внешними сервисами. API должно поддерживать аутентификацию, rate limiting, логирование и мониторинг.",
                "requirements": "FastAPI или Flask, PostgreSQL, Redis для кэширования, документация OpenAPI, система мониторинга.",
                "budget": 180000,
                "deadline": datetime.utcnow() + timedelta(days=45),
                "tech_stack": json.dumps(["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"]),
                "status": ProjectStatus.COMPLETED,
                "assignee": students[1],
                "llm_estimation": "Оценка времени выполнения: 5-6 недель. Разработка API (3 недели), документация (1 неделя), тестирование (1 неделя), деплой и мониторинг (1 неделя).",
            },
            {
                "customer": customers[2],
                "title": "Редизайн корпоративного сайта",
                "description": "Современный редизайн корпоративного сайта с улучшенным UX/UI. Необходимо создать адаптивный дизайн, оптимизировать производительность и SEO.",
                "requirements": "Современный стек: Next.js, TypeScript, Tailwind CSS. Необходима интеграция с CMS, оптимизация изображений, SSR для SEO.",
                "budget": 150000,
                "deadline": datetime.utcnow() + timedelta(days=30),
                "tech_stack": json.dumps(["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS"]),
                "status": ProjectStatus.IN_PROGRESS,
                "assignee": students[3],
                "llm_estimation": "Оценка времени выполнения: 4-5 недель. Дизайн (1 неделя), разработка (2 недели), оптимизация (1 неделя), тестирование и деплой (1 неделя).",
            },
            {
                "customer": customers[0],
                "title": "Автоматизация тестирования",
                "description": "Настройка CI/CD пайплайна и автоматизация тестирования для существующего проекта. Внедрение unit, integration и e2e тестов.",
                "requirements": "GitLab CI/CD, Docker, настройка тестовых окружений, интеграция с системой мониторинга качества кода.",
                "budget": 120000,
                "deadline": datetime.utcnow() + timedelta(days=25),
                "tech_stack": json.dumps(["Docker", "GitLab CI", "Jest", "Cypress", "SonarQube"]),
                "status": ProjectStatus.DRAFT,
                "llm_estimation": None,
            },
        ]

        for data in project_data:
            project = Project(
                customer_id=data["customer"].id,
                title=data["title"],
                description=data["description"],
                requirements=data["requirements"],
                budget=data["budget"],
                deadline=data["deadline"],
                tech_stack=data["tech_stack"],
                status=data["status"],
                assignee_id=data.get("assignee").id if data.get("assignee") else None,
                llm_estimation=data.get("llm_estimation"),
            )
            session.add(project)
            projects.append(project)

        await session.commit()
        print(f"Создано {len(projects)} проектов")

        # Создаем задачи для проектов
        tasks_data = [
            {
                "project": projects[1],
                "tasks": [
                    {"title": "Настройка проекта и окружения", "description": "Настроить React Native проект, установить зависимости, настроить окружения разработки", "complexity": 2, "estimated_hours": 8, "status": TaskStatus.COMPLETED, "assignee": students[2]},
                    {"title": "Разработка экрана каталога ресторанов", "description": "Создать экран со списком ресторанов, фильтрами и поиском", "complexity": 3, "estimated_hours": 16, "status": TaskStatus.IN_PROGRESS, "assignee": students[2]},
                    {"title": "Интеграция с платежной системой", "description": "Интегрировать Stripe для обработки платежей", "complexity": 4, "estimated_hours": 24, "status": TaskStatus.PENDING},
                    {"title": "Реализация отслеживания заказа", "description": "Добавить функционал отслеживания заказа в реальном времени с картами", "complexity": 4, "estimated_hours": 20, "status": TaskStatus.PENDING},
                ],
            },
            {
                "project": projects[2],
                "tasks": [
                    {"title": "Разработка системы видеолекций", "description": "Создать модуль для загрузки и воспроизведения видеолекций", "complexity": 4, "estimated_hours": 32, "status": TaskStatus.COMPLETED, "assignee": students[1]},
                    {"title": "Система тестирования", "description": "Реализовать создание тестов и прохождение их студентами", "complexity": 3, "estimated_hours": 24, "status": TaskStatus.COMPLETED, "assignee": students[1]},
                    {"title": "Дашборд для преподавателей", "description": "Создать аналитический дашборд для отслеживания прогресса студентов", "complexity": 3, "estimated_hours": 20, "status": TaskStatus.REVIEW, "assignee": students[1]},
                ],
            },
            {
                "project": projects[4],
                "tasks": [
                    {"title": "Разработка базового API", "description": "Создать основные endpoints для работы с данными", "complexity": 3, "estimated_hours": 24, "status": TaskStatus.COMPLETED, "assignee": students[1]},
                    {"title": "Система аутентификации", "description": "Реализовать JWT аутентификацию и авторизацию", "complexity": 4, "estimated_hours": 16, "status": TaskStatus.COMPLETED, "assignee": students[1]},
                    {"title": "Документация API", "description": "Создать OpenAPI документацию для всех endpoints", "complexity": 2, "estimated_hours": 12, "status": TaskStatus.COMPLETED, "assignee": students[1]},
                ],
            },
            {
                "project": projects[5],
                "tasks": [
                    {"title": "Создание дизайн-макетов", "description": "Разработать дизайн для всех страниц сайта", "complexity": 3, "estimated_hours": 20, "status": TaskStatus.COMPLETED, "assignee": students[3]},
                    {"title": "Разработка главной страницы", "description": "Реализовать главную страницу с современным дизайном", "complexity": 3, "estimated_hours": 16, "status": TaskStatus.IN_PROGRESS, "assignee": students[3]},
                    {"title": "Оптимизация производительности", "description": "Оптимизировать загрузку страниц и изображений", "complexity": 3, "estimated_hours": 12, "status": TaskStatus.PENDING},
                ],
            },
        ]

        task_order = 1
        for data in tasks_data:
            for task_info in data["tasks"]:
                task = Task(
                    project_id=data["project"].id,
                    title=task_info["title"],
                    description=task_info["description"],
                    complexity=task_info["complexity"],
                    estimated_hours=task_info["estimated_hours"],
                    status=task_info["status"],
                    order=task_order,
                    assignee_id=task_info.get("assignee").id if task_info.get("assignee") else None,
                )
                session.add(task)
                task_order += 1

        await session.commit()
        print("Созданы задачи для проектов")

        # Создаем заявки
        applications_data = [
            {"project": projects[0], "student": students[0], "status": ApplicationStatus.PENDING, "cover_letter": "Имею большой опыт работы с React и Node.js. Выполнил несколько похожих проектов. Готов начать работу немедленно."},
            {"project": projects[0], "student": students[1], "status": ApplicationStatus.PENDING, "cover_letter": "Специализируюсь на backend разработке. Могу помочь с архитектурой и оптимизацией."},
            {"project": projects[3], "student": students[5], "status": ApplicationStatus.PENDING, "cover_letter": "Имею опыт работы с большими данными и аналитикой. Могу реализовать эффективную систему обработки данных."},
            {"project": projects[3], "student": students[1], "status": ApplicationStatus.ACCEPTED, "cover_letter": "Опыт работы с Python и аналитикой. Готов предложить оптимальное решение."},
        ]

        for app_data in applications_data:
            application = Application(
                project_id=app_data["project"].id,
                student_id=app_data["student"].id,
                status=app_data["status"],
                cover_letter=app_data["cover_letter"],
            )
            session.add(application)

        await session.commit()
        print("Созданы заявки на проекты")

        # Создаем рейтинги для завершенного проекта
        if projects[4].status == ProjectStatus.COMPLETED and projects[4].assignee_id:
            rating = Rating(
                project_id=projects[4].id,
                reviewer_id=projects[4].customer_id,
                reviewee_id=projects[4].assignee_id,
                score=5,
                comment="Отличная работа! API получилось качественным, документация подробная. Исполнитель был всегда на связи, все сроки соблюдены.",
                quality_score=5,
                communication_score=5,
                deadline_score=5,
            )
            session.add(rating)

        await session.commit()
        print("Созданы рейтинги")

        print("\n✅ Тестовые данные успешно созданы!")
        print(f"\nСоздано:")
        print(f"  - {len(customers)} заказчиков")
        print(f"  - {len(students)} студентов")
        print(f"  - {len(projects)} проектов")
        print(f"  - {sum(len(d['tasks']) for d in tasks_data)} задач")
        print(f"  - {len(applications_data)} заявок")
        print(f"  - 1 рейтинг")
        print(f"\nТестовые аккаунты:")
        print(f"  Заказчики: customer1@example.com, customer2@example.com, customer3@example.com")
        print(f"  Студенты: student1@example.com, student2@example.com, student3@example.com, ...")
        print(f"  Пароль для всех: password123")


if __name__ == "__main__":
    asyncio.run(create_test_data())


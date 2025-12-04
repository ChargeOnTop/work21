-- Скрипт для заполнения базы данных тестовыми данными
-- Пароль для всех пользователей: password123

-- Очистка существующих данных (опционально, раскомментируйте если нужно)
-- TRUNCATE TABLE ratings, applications, tasks, projects, users RESTART IDENTITY CASCADE;

-- Вставка заказчиков
INSERT INTO users (email, hashed_password, first_name, last_name, role, bio, skills, rating_score, completed_projects, is_active, is_verified, created_at, updated_at) VALUES
('customer1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Алексей', 'Петров', 'customer', 'Опытный предприниматель, работаю в IT-сфере более 10 лет. Ищу талантливых разработчиков для реализации интересных проектов.', NULL, 0.0, 0, true, true, NOW(), NOW()),
('customer2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Мария', 'Сидорова', 'customer', 'Основатель стартапа в области EdTech. Создаю образовательные платформы для студентов.', NULL, 0.0, 0, true, true, NOW(), NOW()),
('customer3@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Дмитрий', 'Иванов', 'customer', 'Руководитель отдела разработки в крупной компании. Постоянно ищу новых талантов.', NULL, 0.0, 0, true, true, NOW(), NOW());

-- Вставка студентов
INSERT INTO users (email, hashed_password, first_name, last_name, role, bio, skills, rating_score, completed_projects, is_active, is_verified, created_at, updated_at) VALUES
('student1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Иван', 'Козлов', 'student', 'Full-stack разработчик с опытом работы с React, Node.js и PostgreSQL. Увлекаюсь созданием современных веб-приложений.', '["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"]', 4.8, 5, true, true, NOW(), NOW()),
('student2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Анна', 'Морозова', 'student', 'Backend разработчик, специализируюсь на Python и FastAPI. Имею опыт работы с микросервисной архитектурой.', '["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"]', 4.6, 3, true, true, NOW(), NOW()),
('student3@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Сергей', 'Волков', 'student', 'Mobile разработчик с опытом создания iOS и Android приложений. Работаю с React Native и нативными технологиями.', '["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"]', 4.9, 7, true, true, NOW(), NOW()),
('student4@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Елена', 'Новикова', 'student', 'Frontend разработчик, специализируюсь на создании пользовательских интерфейсов. Работаю с современными фреймворками.', '["Vue.js", "TypeScript", "Tailwind CSS", "Webpack", "Jest"]', 4.7, 4, true, true, NOW(), NOW()),
('student5@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Павел', 'Соколов', 'student', 'DevOps инженер с опытом настройки CI/CD, контейнеризации и облачных решений.', '["Docker", "Kubernetes", "AWS", "Terraform", "Ansible", "GitLab CI"]', 4.5, 2, true, true, NOW(), NOW()),
('student6@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', 'Ольга', 'Лебедева', 'student', 'Data Engineer, работаю с большими данными и аналитикой. Опыт с Apache Spark и Airflow.', '["Python", "Apache Spark", "Airflow", "PostgreSQL", "MongoDB", "Pandas"]', 4.4, 1, true, true, NOW(), NOW());

-- Вставка проектов
INSERT INTO projects (title, description, requirements, budget, deadline, tech_stack, status, customer_id, assignee_id, llm_estimation, created_at, updated_at) VALUES
('Разработка веб-приложения для управления задачами', 'Необходимо создать современное веб-приложение для управления задачами команды. Приложение должно поддерживать создание проектов, задач, назначение исполнителей, отслеживание прогресса. Требуется интеграция с системами уведомлений.', 'React на фронтенде, Node.js на бэкенде, PostgreSQL для базы данных. Должна быть реализована система аутентификации и авторизации. Необходима адаптивная верстка для мобильных устройств.', 200000, NOW() + INTERVAL '60 days', '["React", "Node.js", "PostgreSQL", "TypeScript"]', 'open', 1, NULL, 'Оценка времени выполнения: 6-8 недель. Проект включает разработку фронтенда (3 недели), бэкенда (3 недели), интеграцию и тестирование (2 недели).', NOW(), NOW()),
('Мобильное приложение для доставки еды', 'Разработка кроссплатформенного мобильного приложения для заказа и доставки еды. Приложение должно включать каталог ресторанов, корзину, систему оплаты, отслеживание заказа в реальном времени.', 'React Native для кроссплатформенной разработки, интеграция с платежными системами, push-уведомления, карты для отслеживания доставки.', 350000, NOW() + INTERVAL '90 days', '["React Native", "Firebase", "Stripe", "Google Maps API"]', 'in_progress', 1, 5, 'Оценка времени выполнения: 10-12 недель. Включает разработку UI/UX (2 недели), интеграцию с API (3 недели), платежные системы (2 недели), тестирование (2 недели), деплой (1 неделя).', NOW(), NOW()),
('Платформа для онлайн-обучения', 'Создание платформы для проведения онлайн-курсов с возможностью видеолекций, тестов, домашних заданий и отслеживания прогресса студентов.', 'Современный стек: Vue.js, Python FastAPI, PostgreSQL. Необходима интеграция с видеохостингами, система оценки работ, аналитика для преподавателей.', 450000, NOW() + INTERVAL '120 days', '["Vue.js", "Python", "FastAPI", "PostgreSQL", "Redis"]', 'review', 2, 2, 'Оценка времени выполнения: 14-16 недель. Разработка включает фронтенд (4 недели), бэкенд (5 недель), интеграцию с видео (2 недели), тестирование (3 недели), деплой (2 недели).', NOW(), NOW()),
('Система аналитики для бизнеса', 'Разработка системы для сбора, обработки и визуализации бизнес-данных. Система должна поддерживать различные источники данных, создание дашбордов и отчетов.', 'Python для обработки данных, веб-интерфейс на React, база данных для хранения метрик. Необходима интеграция с популярными CRM и ERP системами.', 300000, NOW() + INTERVAL '75 days', '["Python", "React", "PostgreSQL", "Apache Spark", "D3.js"]', 'open', 2, NULL, 'Оценка времени выполнения: 9-11 недель. Включает разработку ETL процессов (3 недели), веб-интерфейса (3 недели), визуализации (2 недели), интеграции (2 недели), тестирование (1 неделя).', NOW(), NOW()),
('API для интеграции с внешними сервисами', 'Создание RESTful API для интеграции корпоративной системы с внешними сервисами. API должно поддерживать аутентификацию, rate limiting, логирование и мониторинг.', 'FastAPI или Flask, PostgreSQL, Redis для кэширования, документация OpenAPI, система мониторинга.', 180000, NOW() + INTERVAL '45 days', '["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"]', 'completed', 3, 2, 'Оценка времени выполнения: 5-6 недель. Разработка API (3 недели), документация (1 неделя), тестирование (1 неделя), деплой и мониторинг (1 неделя).', NOW(), NOW()),
('Редизайн корпоративного сайта', 'Современный редизайн корпоративного сайта с улучшенным UX/UI. Необходимо создать адаптивный дизайн, оптимизировать производительность и SEO.', 'Современный стек: Next.js, TypeScript, Tailwind CSS. Необходима интеграция с CMS, оптимизация изображений, SSR для SEO.', 150000, NOW() + INTERVAL '30 days', '["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS"]', 'in_progress', 3, 4, 'Оценка времени выполнения: 4-5 недель. Дизайн (1 неделя), разработка (2 недели), оптимизация (1 неделя), тестирование и деплой (1 неделя).', NOW(), NOW()),
('Автоматизация тестирования', 'Настройка CI/CD пайплайна и автоматизация тестирования для существующего проекта. Внедрение unit, integration и e2e тестов.', 'GitLab CI/CD, Docker, настройка тестовых окружений, интеграция с системой мониторинга качества кода.', 120000, NOW() + INTERVAL '25 days', '["Docker", "GitLab CI", "Jest", "Cypress", "SonarQube"]', 'draft', 1, NULL, NULL, NOW(), NOW());

-- Вставка задач
INSERT INTO tasks (project_id, title, description, complexity, estimated_hours, status, "order", assignee_id, created_at) VALUES
-- Задачи для проекта "Мобильное приложение для доставки еды" (project_id = 2)
(2, 'Настройка проекта и окружения', 'Настроить React Native проект, установить зависимости, настроить окружения разработки', 2, 8, 'completed', 1, 5, NOW()),
(2, 'Разработка экрана каталога ресторанов', 'Создать экран со списком ресторанов, фильтрами и поиском', 3, 16, 'in_progress', 2, 5, NOW()),
(2, 'Интеграция с платежной системой', 'Интегрировать Stripe для обработки платежей', 4, 24, 'pending', 3, NULL, NOW()),
(2, 'Реализация отслеживания заказа', 'Добавить функционал отслеживания заказа в реальном времени с картами', 4, 20, 'pending', 4, NULL, NOW()),
-- Задачи для проекта "Платформа для онлайн-обучения" (project_id = 3)
(3, 'Разработка системы видеолекций', 'Создать модуль для загрузки и воспроизведения видеолекций', 4, 32, 'completed', 5, 2, NOW()),
(3, 'Система тестирования', 'Реализовать создание тестов и прохождение их студентами', 3, 24, 'completed', 6, 2, NOW()),
(3, 'Дашборд для преподавателей', 'Создать аналитический дашборд для отслеживания прогресса студентов', 3, 20, 'review', 7, 2, NOW()),
-- Задачи для проекта "API для интеграции с внешними сервисами" (project_id = 5)
(5, 'Разработка базового API', 'Создать основные endpoints для работы с данными', 3, 24, 'completed', 8, 2, NOW()),
(5, 'Система аутентификации', 'Реализовать JWT аутентификацию и авторизацию', 4, 16, 'completed', 9, 2, NOW()),
(5, 'Документация API', 'Создать OpenAPI документацию для всех endpoints', 2, 12, 'completed', 10, 2, NOW()),
-- Задачи для проекта "Редизайн корпоративного сайта" (project_id = 6)
(6, 'Создание дизайн-макетов', 'Разработать дизайн для всех страниц сайта', 3, 20, 'completed', 11, 4, NOW()),
(6, 'Разработка главной страницы', 'Реализовать главную страницу с современным дизайном', 3, 16, 'in_progress', 12, 4, NOW()),
(6, 'Оптимизация производительности', 'Оптимизировать загрузку страниц и изображений', 3, 12, 'pending', 13, NULL, NOW());

-- Вставка заявок
INSERT INTO applications (project_id, student_id, cover_letter, proposed_rate, status, created_at) VALUES
(1, 1, 'Имею большой опыт работы с React и Node.js. Выполнил несколько похожих проектов. Готов начать работу немедленно.', NULL, 'pending', NOW()),
(1, 2, 'Специализируюсь на backend разработке. Могу помочь с архитектурой и оптимизацией.', NULL, 'pending', NOW()),
(4, 6, 'Имею опыт работы с большими данными и аналитикой. Могу реализовать эффективную систему обработки данных.', NULL, 'pending', NOW()),
(4, 2, 'Опыт работы с Python и аналитикой. Готов предложить оптимальное решение.', NULL, 'accepted', NOW());

-- Вставка рейтингов
INSERT INTO ratings (project_id, reviewer_id, reviewee_id, score, comment, quality_score, communication_score, deadline_score, created_at) VALUES
(5, 3, 2, 5, 'Отличная работа! API получилось качественным, документация подробная. Исполнитель был всегда на связи, все сроки соблюдены.', 5, 5, 5, NOW());


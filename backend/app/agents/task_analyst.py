"""
Task Analyst Agent — анализ задач и генерация ТЗ

Функции:
- Анализ требований заказчика
- Декомпозиция проекта на подзадачи
- Оценка сложности и сроков
- Выявление потенциальных рисков
"""
from typing import List, Optional
from dataclasses import dataclass


@dataclass
class TaskSpec:
    """Спецификация задачи"""
    title: str
    description: str
    complexity: int  # 1-5
    estimated_hours: int
    dependencies: List[str]


@dataclass
class ProjectSpec:
    """Сгенерированная спецификация проекта"""
    summary: str
    tasks: List[TaskSpec]
    total_estimated_hours: int
    suggested_budget: float
    risks: List[str]
    tech_recommendations: List[str]


class TaskAnalystAgent:
    """
    AI-агент для анализа задач и генерации технических заданий
    
    В production версии будет использовать LLM (OpenAI/Anthropic)
    для интеллектуального анализа требований.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self._is_configured = api_key is not None
    
    async def analyze_project(
        self, 
        title: str, 
        description: str,
        requirements: Optional[str] = None,
        budget: Optional[float] = None
    ) -> ProjectSpec:
        """
        Анализирует описание проекта и генерирует структурированное ТЗ
        
        Args:
            title: Название проекта
            description: Описание от заказчика
            requirements: Дополнительные требования
            budget: Предполагаемый бюджет
            
        Returns:
            ProjectSpec с разбивкой на задачи и оценками
        """
        # TODO: Интеграция с LLM для реального анализа
        # Сейчас возвращаем заглушку
        
        # Простая эвристика для демонстрации
        tasks = [
            TaskSpec(
                title="Анализ и проектирование",
                description="Детальный анализ требований, проектирование архитектуры",
                complexity=3,
                estimated_hours=16,
                dependencies=[]
            ),
            TaskSpec(
                title="Разработка бэкенда",
                description="Реализация серверной логики и API",
                complexity=4,
                estimated_hours=40,
                dependencies=["Анализ и проектирование"]
            ),
            TaskSpec(
                title="Разработка фронтенда",
                description="Реализация пользовательского интерфейса",
                complexity=4,
                estimated_hours=40,
                dependencies=["Анализ и проектирование"]
            ),
            TaskSpec(
                title="Тестирование и отладка",
                description="QA, исправление багов, оптимизация",
                complexity=3,
                estimated_hours=16,
                dependencies=["Разработка бэкенда", "Разработка фронтенда"]
            ),
            TaskSpec(
                title="Документация и деплой",
                description="Написание документации, развёртывание",
                complexity=2,
                estimated_hours=8,
                dependencies=["Тестирование и отладка"]
            ),
        ]
        
        total_hours = sum(t.estimated_hours for t in tasks)
        
        return ProjectSpec(
            summary=f"Проект '{title}' разбит на {len(tasks)} этапов",
            tasks=tasks,
            total_estimated_hours=total_hours,
            suggested_budget=budget or total_hours * 1500,  # ~1500 руб/час
            risks=[
                "Неточность первоначальных требований",
                "Возможные задержки при интеграции",
                "Необходимость дополнительного тестирования"
            ],
            tech_recommendations=[
                "Использовать современный стек технологий",
                "Настроить CI/CD для автоматизации",
                "Документировать API с помощью OpenAPI"
            ]
        )
    
    async def estimate_complexity(self, description: str) -> int:
        """
        Оценивает сложность задачи по описанию (1-5)
        """
        # TODO: LLM-based оценка
        # Простая эвристика по длине описания
        word_count = len(description.split())
        if word_count < 50:
            return 2
        elif word_count < 150:
            return 3
        elif word_count < 300:
            return 4
        else:
            return 5


"""
Talent Matcher Agent — подбор исполнителей

Функции:
- Поиск студентов по навыкам
- Анализ рейтинга и портфолио
- Проверка доступности
- Ранжирование кандидатов
"""
from typing import List, Optional
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole


@dataclass
class CandidateScore:
    """Оценка кандидата"""
    user_id: int
    name: str
    email: str
    rating_score: float
    completed_projects: int
    skill_match: float  # 0-1
    availability_score: float  # 0-1
    total_score: float  # Итоговый балл


class TalentMatcherAgent:
    """
    AI-агент для подбора исполнителей под проект
    
    Анализирует навыки, рейтинг и историю студентов,
    чтобы найти лучших кандидатов для конкретного проекта.
    """
    
    def __init__(self):
        pass
    
    async def find_candidates(
        self,
        db: AsyncSession,
        required_skills: List[str],
        budget: float,
        complexity: int = 3,
        limit: int = 10
    ) -> List[CandidateScore]:
        """
        Находит подходящих кандидатов для проекта
        
        Args:
            db: Сессия базы данных
            required_skills: Требуемые навыки
            budget: Бюджет проекта
            complexity: Сложность проекта (1-5)
            limit: Максимальное число кандидатов
            
        Returns:
            Список кандидатов с оценками
        """
        # Получаем активных студентов
        result = await db.execute(
            select(User)
            .where(User.role == UserRole.STUDENT)
            .where(User.is_active == True)
            .order_by(User.rating_score.desc())
            .limit(limit * 2)  # Берём с запасом для фильтрации
        )
        students = result.scalars().all()
        
        candidates = []
        for student in students:
            # Рассчитываем соответствие навыков
            skill_match = self._calculate_skill_match(
                student.skills, 
                required_skills
            )
            
            # Проверяем доступность (заглушка)
            availability = self._check_availability(student)
            
            # Итоговый балл
            total_score = (
                student.rating_score * 0.4 +  # 40% - рейтинг
                skill_match * 100 * 0.4 +      # 40% - соответствие навыков
                availability * 100 * 0.2       # 20% - доступность
            )
            
            candidates.append(CandidateScore(
                user_id=student.id,
                name=student.full_name,
                email=student.email,
                rating_score=student.rating_score,
                completed_projects=student.completed_projects,
                skill_match=skill_match,
                availability_score=availability,
                total_score=total_score
            ))
        
        # Сортируем по итоговому баллу и возвращаем топ
        candidates.sort(key=lambda x: x.total_score, reverse=True)
        return candidates[:limit]
    
    def _calculate_skill_match(
        self, 
        user_skills: Optional[str], 
        required_skills: List[str]
    ) -> float:
        """
        Рассчитывает соответствие навыков пользователя требованиям
        
        Returns:
            Значение от 0 до 1
        """
        if not user_skills or not required_skills:
            return 0.5  # Нейтральное значение
        
        try:
            import json
            skills = json.loads(user_skills)
            if not isinstance(skills, list):
                return 0.5
        except (json.JSONDecodeError, TypeError):
            # Если skills хранится как строка через запятую
            skills = [s.strip().lower() for s in user_skills.split(",")]
        
        required_lower = [s.lower() for s in required_skills]
        skills_lower = [s.lower() for s in skills]
        
        matches = sum(1 for skill in required_lower if skill in skills_lower)
        return matches / len(required_skills) if required_skills else 0.5
    
    def _check_availability(self, user: User) -> float:
        """
        Проверяет доступность студента
        
        В production версии будет учитывать:
        - Текущие активные проекты
        - Загруженность
        - График работы
        
        Returns:
            Значение от 0 до 1
        """
        # TODO: Реальная проверка загруженности
        # Пока возвращаем фиксированное значение
        return 0.8
    
    async def rank_applications(
        self,
        db: AsyncSession,
        project_id: int
    ) -> List[CandidateScore]:
        """
        Ранжирует существующие заявки на проект
        """
        # TODO: Реализовать ранжирование заявок
        pass



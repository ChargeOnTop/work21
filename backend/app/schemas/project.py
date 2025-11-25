"""
Pydantic схемы для проектов, задач и заявок
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.project import ProjectStatus, TaskStatus, ApplicationStatus


class TaskCreate(BaseModel):
    """Схема для создания задачи"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str
    complexity: int = Field(default=1, ge=1, le=5)
    estimated_hours: Optional[int] = None
    deadline: Optional[datetime] = None
    order: int = 0


class TaskResponse(TaskCreate):
    """Схема ответа с данными задачи"""
    id: int
    status: TaskStatus
    project_id: int
    assignee_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Базовая схема проекта"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str
    requirements: Optional[str] = None
    budget: float = Field(..., gt=0)
    deadline: Optional[datetime] = None
    tech_stack: Optional[List[str]] = None


class ProjectCreate(ProjectBase):
    """Схема для создания проекта"""
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Мобильное приложение для доставки",
                "description": "Разработка кроссплатформенного приложения на React Native",
                "requirements": "iOS и Android, интеграция с Firebase, push-уведомления",
                "budget": 150000,
                "deadline": "2025-02-01T00:00:00",
                "tech_stack": ["React Native", "Firebase", "TypeScript"]
            }
        }


class ProjectUpdate(BaseModel):
    """Схема для обновления проекта"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    requirements: Optional[str] = None
    budget: Optional[float] = Field(None, gt=0)
    deadline: Optional[datetime] = None
    tech_stack: Optional[List[str]] = None
    status: Optional[ProjectStatus] = None


class ProjectResponse(ProjectBase):
    """Схема ответа с данными проекта"""
    id: int
    status: ProjectStatus
    customer_id: int
    generated_spec: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tasks: List[TaskResponse] = []
    
    class Config:
        from_attributes = True


class ApplicationCreate(BaseModel):
    """Схема для создания заявки"""
    project_id: int
    cover_letter: Optional[str] = None
    proposed_rate: Optional[float] = Field(None, gt=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_id": 1,
                "cover_letter": "Имею опыт работы с React Native более 2 лет...",
                "proposed_rate": 140000
            }
        }


class ApplicationResponse(BaseModel):
    """Схема ответа с данными заявки"""
    id: int
    project_id: int
    student_id: int
    cover_letter: Optional[str] = None
    proposed_rate: Optional[float] = None
    status: ApplicationStatus
    created_at: datetime
    
    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    """Схема для обновления статуса заявки"""
    status: ApplicationStatus


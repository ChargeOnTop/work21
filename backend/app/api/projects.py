"""
API endpoints для проектов
"""
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User, UserRole
from app.models.project import Project, Task, Application, ProjectStatus, ApplicationStatus
from app.schemas.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectResponse,
    TaskCreate,
    TaskResponse,
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)


router = APIRouter()


# ===== ПРОЕКТЫ =====

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Создать новый проект (только для заказчиков)
    """
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только заказчики могут создавать проекты"
        )
    
    # Преобразуем tech_stack в JSON строку
    tech_stack = None
    if project_data.tech_stack:
        tech_stack = json.dumps(project_data.tech_stack)
    
    project = Project(
        title=project_data.title,
        description=project_data.description,
        requirements=project_data.requirements,
        budget=project_data.budget,
        deadline=project_data.deadline,
        tech_stack=tech_stack,
        customer_id=current_user.id,
        status=ProjectStatus.DRAFT,
    )
    
    db.add(project)
    await db.commit()
    await db.refresh(project)
    
    return project


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    status: Optional[ProjectStatus] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список проектов
    """
    query = select(Project).options(selectinload(Project.tasks))
    
    if status:
        query = query.where(Project.status == status)
    else:
        # По умолчанию показываем открытые проекты
        query = query.where(Project.status == ProjectStatus.OPEN)
    
    query = query.order_by(Project.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/my", response_model=List[ProjectResponse])
async def list_my_projects(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить проекты текущего пользователя
    """
    if current_user.role == UserRole.CUSTOMER:
        # Для заказчика — его проекты
        result = await db.execute(
            select(Project)
            .options(selectinload(Project.tasks))
            .where(Project.customer_id == current_user.id)
            .order_by(Project.created_at.desc())
        )
    else:
        # Для студента — проекты, на которые он подал заявку
        result = await db.execute(
            select(Project)
            .options(selectinload(Project.tasks))
            .join(Application)
            .where(Application.student_id == current_user.id)
            .order_by(Project.created_at.desc())
        )
    
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Получить проект по ID
    """
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.tasks))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Проект не найден"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить проект (только владелец)
    """
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Проект не найден"
        )
    
    if project.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на редактирование этого проекта"
        )
    
    update_data = project_data.model_dump(exclude_unset=True)
    
    if "tech_stack" in update_data and update_data["tech_stack"]:
        update_data["tech_stack"] = json.dumps(update_data["tech_stack"])
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    await db.commit()
    await db.refresh(project)
    
    return project


@router.post("/{project_id}/publish", response_model=ProjectResponse)
async def publish_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Опубликовать проект (перевести в статус OPEN)
    """
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Проект не найден"
        )
    
    if project.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на публикацию этого проекта"
        )
    
    if project.status != ProjectStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Можно опубликовать только черновик"
        )
    
    project.status = ProjectStatus.OPEN
    await db.commit()
    await db.refresh(project)
    
    return project


# ===== ЗАЯВКИ =====

@router.post("/{project_id}/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_for_project(
    project_id: int,
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Подать заявку на проект (только для студентов)
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только студенты могут подавать заявки"
        )
    
    # Проверяем проект
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Проект не найден"
        )
    
    if project.status != ProjectStatus.OPEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Проект не открыт для заявок"
        )
    
    # Проверяем, нет ли уже заявки от этого студента
    existing = await db.execute(
        select(Application)
        .where(Application.project_id == project_id)
        .where(Application.student_id == current_user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы уже подали заявку на этот проект"
        )
    
    application = Application(
        project_id=project_id,
        student_id=current_user.id,
        cover_letter=application_data.cover_letter,
        proposed_rate=application_data.proposed_rate,
    )
    
    db.add(application)
    await db.commit()
    await db.refresh(application)
    
    return application


@router.get("/{project_id}/applications", response_model=List[ApplicationResponse])
async def list_project_applications(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить заявки на проект (только владелец проекта)
    """
    # Проверяем проект
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Проект не найден"
        )
    
    if project.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к заявкам этого проекта"
        )
    
    result = await db.execute(
        select(Application)
        .where(Application.project_id == project_id)
        .order_by(Application.created_at.desc())
    )
    
    return result.scalars().all()


@router.put("/{project_id}/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status(
    project_id: int,
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить статус заявки (принять/отклонить)
    """
    # Проверяем проект
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project or project.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа"
        )
    
    # Получаем заявку
    result = await db.execute(
        select(Application)
        .where(Application.id == application_id)
        .where(Application.project_id == project_id)
    )
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    application.status = status_data.status
    
    # Если заявка принята, переводим проект в статус IN_PROGRESS
    if status_data.status == ApplicationStatus.ACCEPTED:
        project.status = ProjectStatus.IN_PROGRESS
    
    await db.commit()
    await db.refresh(application)
    
    return application



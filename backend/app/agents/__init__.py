"""
AI-агенты WORK21

Три ключевых агента:
- Task Analyst — анализ задач, генерация ТЗ
- Talent Matcher — подбор исполнителей
- Legal Assistant — генерация договоров
"""
from app.agents.task_analyst import TaskAnalystAgent
from app.agents.talent_matcher import TalentMatcherAgent
from app.agents.legal_assistant import LegalAssistantAgent

__all__ = [
    "TaskAnalystAgent",
    "TalentMatcherAgent",
    "LegalAssistantAgent",
]


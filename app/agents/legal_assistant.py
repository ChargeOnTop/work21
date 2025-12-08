"""
Legal Assistant Agent — генерация договоров

Функции:
- Генерация типового договора
- Фиксация условий и сроков
- Определение ответственности сторон
- Обработка и закрытие договоров
"""
from datetime import datetime, timedelta
from typing import Optional
from dataclasses import dataclass


@dataclass
class ContractTerms:
    """Условия договора"""
    project_title: str
    customer_name: str
    student_name: str
    total_amount: float
    platform_fee: float
    student_payment: float
    deadline: datetime
    milestones: list[dict]
    terms_text: str


class LegalAssistantAgent:
    """
    AI-агент для генерации и управления договорами
    
    Формирует типовые договоры, защищающие интересы
    обеих сторон — заказчика и исполнителя.
    """
    
    PLATFORM_FEE_RATE = 0.10  # 10% комиссия платформы
    
    def __init__(self):
        pass
    
    def generate_contract(
        self,
        project_title: str,
        project_description: str,
        customer_name: str,
        student_name: str,
        budget: float,
        deadline: Optional[datetime] = None,
        milestones: Optional[list[dict]] = None
    ) -> ContractTerms:
        """
        Генерирует условия договора на основе параметров проекта
        
        Args:
            project_title: Название проекта
            project_description: Описание проекта
            customer_name: Имя заказчика
            student_name: Имя исполнителя
            budget: Бюджет проекта
            deadline: Срок выполнения
            milestones: Этапы проекта
            
        Returns:
            ContractTerms с полным текстом договора
        """
        # Рассчитываем суммы
        platform_fee = budget * self.PLATFORM_FEE_RATE
        student_payment = budget
        total_amount = budget + platform_fee
        
        # Устанавливаем дедлайн если не указан
        if deadline is None:
            deadline = datetime.utcnow() + timedelta(days=30)
        
        # Формируем этапы если не указаны
        if milestones is None:
            milestones = [
                {"name": "Начало работ", "percentage": 0},
                {"name": "Промежуточная сдача (50%)", "percentage": 50},
                {"name": "Финальная сдача", "percentage": 100},
            ]
        
        # Генерируем текст договора
        terms_text = self._generate_terms_text(
            project_title=project_title,
            project_description=project_description,
            customer_name=customer_name,
            student_name=student_name,
            total_amount=total_amount,
            platform_fee=platform_fee,
            student_payment=student_payment,
            deadline=deadline,
            milestones=milestones
        )
        
        return ContractTerms(
            project_title=project_title,
            customer_name=customer_name,
            student_name=student_name,
            total_amount=total_amount,
            platform_fee=platform_fee,
            student_payment=student_payment,
            deadline=deadline,
            milestones=milestones,
            terms_text=terms_text
        )
    
    def _generate_terms_text(
        self,
        project_title: str,
        project_description: str,
        customer_name: str,
        student_name: str,
        total_amount: float,
        platform_fee: float,
        student_payment: float,
        deadline: datetime,
        milestones: list[dict]
    ) -> str:
        """
        Генерирует текст договора
        """
        deadline_str = deadline.strftime("%d.%m.%Y")
        
        milestones_text = "\n".join([
            f"  - {m['name']}: {m['percentage']}% выполнения"
            for m in milestones
        ])
        
        return f"""
ДОГОВОР НА ВЫПОЛНЕНИЕ РАБОТ
Платформа WORK21

Дата: {datetime.utcnow().strftime("%d.%m.%Y")}

1. СТОРОНЫ ДОГОВОРА

Заказчик: {customer_name}
Исполнитель: {student_name}
Посредник: Платформа WORK21

2. ПРЕДМЕТ ДОГОВОРА

2.1. Исполнитель обязуется выполнить работы по проекту "{project_title}" 
     в соответствии с техническим заданием.

2.2. Описание работ:
     {project_description}

3. СРОКИ ВЫПОЛНЕНИЯ

3.1. Срок выполнения работ: до {deadline_str}

3.2. Этапы выполнения:
{milestones_text}

4. СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ

4.1. Общая стоимость работ: {student_payment:,.0f} ₽
4.2. Комиссия платформы: {platform_fee:,.0f} ₽
4.3. Итого к оплате Заказчиком: {total_amount:,.0f} ₽

4.4. Порядок оплаты:
     - Заказчик вносит полную сумму на счёт платформы до начала работ
     - Платформа удерживает средства как гарант до приёмки работ
     - После приёмки работ средства переводятся Исполнителю

5. ОБЯЗАННОСТИ СТОРОН

5.1. Исполнитель обязуется:
     - Выполнить работы качественно и в срок
     - Предоставлять отчёты о ходе выполнения
     - Вносить корректировки по замечаниям Заказчика

5.2. Заказчик обязуется:
     - Предоставить необходимую информацию для выполнения работ
     - Своевременно проверять и принимать результаты
     - Произвести оплату в соответствии с п.4

6. ОТВЕТСТВЕННОСТЬ

6.1. Платформа WORK21 выступает гарантом сделки и обеспечивает:
     - Безопасность платежей
     - Разрешение споров
     - Защиту персональных данных

7. ПРОЧИЕ УСЛОВИЯ

7.1. Все изменения и дополнения к договору действительны при
     согласовании обеими сторонами через платформу.

7.2. Договор вступает в силу после подтверждения обеими сторонами.

---
Договор сгенерирован платформой WORK21
        """.strip()
    
    def calculate_fees(self, budget: float) -> dict:
        """
        Рассчитывает комиссии и выплаты
        """
        platform_fee = budget * self.PLATFORM_FEE_RATE
        return {
            "budget": budget,
            "platform_fee": platform_fee,
            "student_payment": budget,
            "total_amount": budget + platform_fee,
            "fee_rate": self.PLATFORM_FEE_RATE
        }



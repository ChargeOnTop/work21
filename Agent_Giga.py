from openai import OpenAI
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import re
import json
import time
from dotenv import load_dotenv
import os
from langchain_gigachat.chat_models import GigaChat
load_dotenv()
model = GigaChat(
    credentials=os.getenv('API_KEY'),
    scope="GIGACHAT_API_PERS",
    model="GigaChat",
    verify_ssl_certs=False,
)

# ------------------- Утилиты -------------------

def _clean_text(s: str) -> str:
    return re.sub(r'\s+', ' ', s).strip()

def _format_date(dt: datetime) -> str:
    return dt.strftime("%d.%m.%Y")

def _extract_json_block(text: str) -> Optional[str]:
    """
    Находит и возвращает первую JSON-структуру в тексте:
    - сначала пытается найти блок ```json ... ```
    - затем пытается найти первую скобку { ... } с учётом вложенности
    Возвращает строку JSON или None.
    """
    # 1) ```json``` блок
    m = re.search(r"```json\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    if m:
        return m.group(1)

    # 2) просто { ... } - ищем первую корректно сбалансированную фигурную скобку
    start = text.find("{")
    if start == -1:
        return None
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start:i+1]
    return None
def _retry_api_call(func, retries=3, backoff=1, *args, **kwargs):
    """
    Простая функция retry с экспоненциальным бэкоффом.
    func — callable без аргументов, возвращает результат вызова API.
    retries — число попыток, backoff — базовая пауза в секундах.
    """
    last_exc = None
    for attempt in range(1, retries + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            last_exc = e
            if attempt == retries:
                # Если последний, пробрасываем ошибку дальше с более полезным сообщением
                raise
            # Ждём экспоненциально (backoff, 2*backoff, 4*backoff ...)
            sleep_time = backoff * (2 ** (attempt - 1))
            try:
                time.sleep(sleep_time)
            except Exception:
                # в редком случае, если sleep не работает, просто continue
                pass
    # если дошли до сюда — пробрасываем последнее исключение
    raise last_exc

# ------------------- Универсальный отправщик запроса к LLM (поддерживает client или model) -------------------

def send_chat_request(messages: List[Dict[str, str]], model_name: str = None, temperature: float = 0.0, max_tokens: int = 2000):
    """
    Универсальная обёртка отправки chat-запроса с улучшенной обработкой ответов.
    Попытки вызовов (порядок): invoke, generate, predict_messages, predict, __call__.
    Возвращает строку с ответом (raw text). При неудаче бросает RuntimeError с диагностикой
    и кусочком "сырого" ответа для отладки.
    """
    msgs_payload = messages

    # Вспомогательная функция: извлечь текст из самых распространённых структур ответа
    def _extract_text(resp):
        try:
            # если None
            if resp is None:
                return None
            # if LangChain-like object with .generations
            if hasattr(resp, "generations"):
                try:
                    return resp.generations[0][0].text
                except Exception:
                    try:
                        return resp.generations[0].text
                    except Exception:
                        pass
            # if has .text or .content attributes
            if hasattr(resp, "text"):
                return getattr(resp, "text")
            if hasattr(resp, "content"):
                return getattr(resp, "content")
            # If it's a dict-like structure
            if isinstance(resp, dict):
                # common keys to try
                # 1) 'text'
                if "text" in resp and isinstance(resp["text"], str):
                    return resp["text"]
                # 2) 'content'
                if "content" in resp and isinstance(resp["content"], str):
                    return resp["content"]
                # 3) 'result' or 'response' or 'output'
                for k in ("result", "response", "output"):
                    if k in resp and isinstance(resp[k], str):
                        return resp[k]
                # 4) 'choices' -> try common nested shapes
                if "choices" in resp and isinstance(resp["choices"], (list, tuple)) and resp["choices"]:
                    c0 = resp["choices"][0]
                    if isinstance(c0, dict):
                        # message.content
                        if "message" in c0 and isinstance(c0["message"], dict) and "content" in c0["message"]:
                            return c0["message"]["content"]
                        # text
                        if "text" in c0 and isinstance(c0["text"], str):
                            return c0["text"]
                    elif isinstance(c0, str):
                        return c0
                # 5) If resp contains 'output' as list/dict
                if "output" in resp:
                    out = resp["output"]
                    # if list of chunks with 'content' or 'text'
                    if isinstance(out, list) and out:
                        first = out[0]
                        if isinstance(first, dict):
                            for k in ("content", "text", "response"):
                                if k in first and isinstance(first[k], str):
                                    return first[k]
                        if isinstance(first, str):
                            return first
                    if isinstance(out, dict):
                        for k in ("content", "text", "response"):
                            if k in out and isinstance(out[k], str):
                                return out[k]
                # 6) last resort: join string values in dict (small heuristic)
                str_vals = []
                def collect_strs(x):
                    if isinstance(x, str):
                        str_vals.append(x)
                    elif isinstance(x, dict):
                        for v in x.values():
                            collect_strs(v)
                    elif isinstance(x, list):
                        for e in x:
                            collect_strs(e)
                collect_strs(resp)
                if str_vals:
                    # возвращаем первые 2-3 накопленных строк (слишком длинные можно усечть)
                    joined = "\n".join(str_vals[:3])
                    return joined
            # if it's simple string
            if isinstance(resp, str):
                return resp
            # fallback: string representation
            return str(resp)
        except Exception as e:
            # в случае ошибки при извлечении — возвращаем repr для отладки
            return f"<extract_error: {e}> {repr(resp)[:1000]}"

    last_exc = None
    diagnostics = []

    # 1) OpenAI-like client (если присутствует)
    if "client" in globals() and getattr(globals()["client"], "chat", None) is not None:
        try:
            c = globals()["client"]
            resp = c.chat.completions.create(
                model=model_name or "openai/gpt-oss-20b",
                messages=msgs_payload,
                temperature=temperature,
                max_tokens=max_tokens
            )
            diagnostics.append("used client.chat.completions.create")
            return _extract_text(resp)
        except Exception as e:
            last_exc = f"client.chat failed: {e}"
            diagnostics.append(last_exc)

    # 2) Попытка вызвать model.invoke (рекомендуемый метод в новых LangChain)
    if "model" in globals():
        m = globals()["model"]
        diagnostics.append(f"model type: {type(m).__name__}")
        # try invoke / ainvoke
        if hasattr(m, "invoke"):
            try:
                resp = m.invoke(messages=msgs_payload)
                diagnostics.append("used model.invoke")
                text = _extract_text(resp)
                if text:
                    return text
            except Exception as e:
                last_exc = f"model.invoke failed: {e}"
                diagnostics.append(last_exc)
        # try generate / agenerate
        if hasattr(m, "generate"):
            try:
                # some implementations expect different shapes; try send list of dicts as we have
                resp = m.generate([{"role": msg["role"], "content": msg["content"]} for msg in msgs_payload])
                diagnostics.append("used model.generate")
                text = _extract_text(resp)
                if text:
                    return text
            except Exception as e:
                last_exc = f"model.generate failed: {e}"
                diagnostics.append(last_exc)
        # try predict_messages / predict
        for method in ("predict_messages", "predict", "apredict", "apredict_messages", "agenerate", "agenerate_prompt"):
            if hasattr(m, method):
                try:
                    func = getattr(m, method)
                    # best-effort: try messages, or joined text
                    try:
                        resp = func(messages=msgs_payload)
                    except TypeError:
                        # some predict expect a single string
                        joined = "\n".join([msg["content"] for msg in msgs_payload if msg["role"] == "user" or True])
                        resp = func(joined)
                    diagnostics.append(f"used model.{method}")
                    text = _extract_text(resp)
                    if text:
                        return text
                except Exception as e:
                    last_exc = f"model.{method} failed: {e}"
                    diagnostics.append(last_exc)
        # try chat / chat_completion
        for method in ("chat", "chat_completion", "astream", "astream_events"):
            if hasattr(m, method):
                try:
                    resp = getattr(m, method)(msgs_payload)
                    diagnostics.append(f"used model.{method}")
                    text = _extract_text(resp)
                    if text:
                        return text
                except Exception as e:
                    last_exc = f"model.{method} failed: {e}"
                    diagnostics.append(last_exc)
        # try __call__ as last resort (deprecated in some versions)
        if callable(m):
            try:
                resp = m(messages=msgs_payload)
                diagnostics.append("used model.__call__")
                text = _extract_text(resp)
                if text:
                    return text
            except Exception as e:
                last_exc = f"model.__call__ failed: {e}"
                diagnostics.append(last_exc)

    # если ничего не сработало — сформируем диагностическое сообщение с кусочком "сырого" ответа (если есть)
    diag_text = " | ".join(diagnostics)
    sample_raw = ""
    try:
        # если last_exc содержит объект/текст ответа — добавим кусочек, иначе ничего
        sample_raw = f" last_exc_repr={repr(last_exc)[:1200]}"
    except Exception:
        sample_raw = ""
    raise RuntimeError("Не удалось успешно вызвать модель. Диагностика: " + diag_text + sample_raw)



# ------------------- Обновлённая generate_todo_from_spec_json (использует send_chat_request) -------------------

def generate_todo_from_spec_json(title: str, spec_text: str, model: str = "openai/gpt-oss-20b") -> Dict[str, Any]:
    title = _clean_text(title)
    spec_text = _clean_text(spec_text)

    prompt = f"""
Ты — экспертный инженер-аналитик. Разбери техническое задание и верни СТРОГО JSON по следующей схеме.

Шаблон ответа (обязательный):
{{
  "project": {{
    "title": "<короткое название проекта>",
    "summary": "<одна-две строки сводки>"
  }},
  "tasks": [
    {{
      "id": "T1",
      "title": "Короткое название",
      "description": "Пояснение для исполнителя, 1-2 предложения.",
      "hours": 8,
      "priority": "высокий|средний|низкий",
      "role": "backend|frontend|devops|qa|ux|pm",
      "depends_on": []
    }}
  ],
  "critical_paths": []
}}

Требования:
- Верни только JSON или JSON внутри ```json``` блока.
- Часы — целые числа.
- Поля role/priority — из указанных значений.
Вход:
Название проекта: {title}
ТЗ: {spec_text}

ВЕРНИ ТОЛЬКО JSON (или JSON в ```json``` блоке).
"""

    messages = [
        {"role": "system", "content": "Ты — инженер-аналитик, отвечай строго по инструкции."},
        {"role": "user", "content": prompt}
    ]

    # Используем универсальный отправщик с retry
    api_call = lambda: send_chat_request(messages=messages, model_name=model, temperature=0.0, max_tokens=2000)
    raw = _retry_api_call(api_call, retries=3, backoff=1)

    # Попытка распарсить JSON, как и раньше
    json_block = _extract_json_block(raw)
    if not json_block:
        raise ValueError("Не удалось извлечь JSON из ответа модели. Ответ модели:\n" + (raw[:2000] if isinstance(raw, str) else str(raw)))

    try:
        parsed = json.loads(json_block)
    except json.JSONDecodeError as e:
        cleaned = re.sub(r"//.*?$", "", json_block, flags=re.MULTILINE)
        try:
            parsed = json.loads(cleaned)
        except Exception as e2:
            raise ValueError(f"JSON распарсить не удалось: {e}\nПосле очистки: {e2}\nСырой JSON:\n{json_block[:2000]}")
    return parsed


# ------------------- 2) Оценка стоимости (принимает структурные задачи) -------------------

DEFAULT_RATES_PER_HOUR = {
    "backend": 50,
    "frontend": 45,
    "devops": 60,
    "qa": 30,
    "ux": 40,
    "pm": 70,
    "default": 45
}

def estimate_cost_from_structured_tasks(tasks: List[Dict[str,Any]], rates: Dict[str,float] = DEFAULT_RATES_PER_HOUR) -> Dict[str,Any]:
    breakdown = []
    total = 0.0
    for t in tasks:
        hours = int(t.get("hours", 0))
        role = t.get("role", "default")
        rate = rates.get(role, rates["default"])
        cost = hours * rate
        breakdown.append({
            "id": t.get("id"),
            "title": t.get("title"),
            "hours": hours,
            "role": role,
            "rate": rate,
            "cost": cost
        })
        total += cost
    return {"breakdown": breakdown, "total": total}

# ------------------- 3) Оценка сроков (принимает структурные задачи) -------------------

def estimate_timeline_structured(tasks: List[Dict[str,Any]], project_start: datetime = None, daily_capacity_hours: int = 6) -> Dict[str,Any]:
    if project_start is None:
        project_start = datetime.now()

    # Создаём карту задач по id для быстрого доступа
    id_map = {t["id"]: t for t in tasks}
    # Вычисляем длительность в днях и помечаем нераспределённые зависимости
    schedule = []
    # Для простоты — назначаем каждому role свой "work pointer" (дата, с которой свободен исполнитель)
    role_next_free = {}

    def hours_to_days(h):
        return max(1, (h + daily_capacity_hours - 1) // daily_capacity_hours)

    # Сортируем задачи так: сначала те, у кого нет зависимостей (простая топологическая идея)
    # Простая топологическая сортировка (без детального цикла/ошибок на циклы)
    ordered = []
    remaining = set(id_map.keys())
    deps_map = {tid: set(id_map[tid].get("depends_on", [])) for tid in id_map}
    # удаляем несуществующие зависимости
    for k in deps_map:
        deps_map[k] = {d for d in deps_map[k] if d in id_map}

    while remaining:
        # находим задачи без зависимостей среди remaining
        ready = [r for r in remaining if not deps_map[r]]
        if not ready:
            # цикл зависимостей обнаружен или что-то не так — тогда просто добавляем оставшиеся
            ready = list(remaining)
        for r in ready:
            ordered.append(id_map[r])
            remaining.remove(r)
            # убираем r из чужих зависимостей
            for k in deps_map:
                deps_map[k].discard(r)

    # Теперь для каждой задачи — назначаем start = max(project_start, max(end_of_dependencies), role_next_free[role])
    dates_for_id = {}
    for t in ordered:
        role = t.get("role", "default")
        hours = int(t.get("hours", 0))
        duration_days = hours_to_days(hours)
        # вычисляем earliest_start:
        deps = t.get("depends_on", []) or []
        deps_end = [datetime.strptime(dates_for_id[d]["end_date"], "%d.%m.%Y") for d in deps if d in dates_for_id]
        earliest = project_start
        if deps_end:
            latest_dep_end = max(deps_end)
            earliest = max(earliest, latest_dep_end + timedelta(days=1))  # старт следующий день после зависимости
        # учёт занятости роли
        role_free = role_next_free.get(role, project_start)
        start = max(earliest, role_free)
        end = start + timedelta(days=duration_days - 1)
        # добавим буфер 20% округлённо
        buffer_days = max(0, int(round(duration_days * 0.2)))
        end_with_buffer = end + timedelta(days=buffer_days)
        dates_for_id[t["id"]] = {
            "id": t["id"],
            "title": t.get("title"),
            "role": role,
            "hours": hours,
            "start_date": _format_date(start),
            "end_date": _format_date(end_with_buffer),
            "duration_days": duration_days + buffer_days,
            "depends_on": deps
        }
        # обновляем роль как занятую до end_with_buffer + 1
        role_next_free[role] = end_with_buffer + timedelta(days=1)

    project_end = max(datetime.strptime(v["end_date"], "%d.%m.%Y") for v in dates_for_id.values()) if dates_for_id else project_start
    total_days = (project_end - project_start).days + 1

    # role_days — сколько дней суммарно для каждой роли
    role_days = {}
    for v in dates_for_id.values():
        role_days.setdefault(v["role"], 0)
        role_days[v["role"]] += v["duration_days"]

    return {
        "project_start": _format_date(project_start),
        "project_end": _format_date(project_end),
        "total_work_days": total_days,
        "role_days": role_days,
        "task_schedule": list(dates_for_id.values())
    }

# ------------------- 4) Унифицированный запуск агента -------------------

def analyst_agent_run(title: str, spec_text: str) -> Dict[str, Any]:
    # 1) Получаем структурированный JSON от модели
    parsed = generate_todo_from_spec_json(title, spec_text)

    tasks = parsed.get("tasks", [])
    # 2) Стоимость
    cost = estimate_cost_from_structured_tasks(tasks)
    # 3) Сроки
    timeline = estimate_timeline_structured(tasks, project_start=datetime.now())

    report = {
        "project": parsed.get("project", {}),
        "tasks": tasks,
        "critical_paths": parsed.get("critical_paths", []),
        "cost_estimate": cost,
        "timeline_estimate": timeline,
        "generated_at": _format_date(datetime.now())
    }
    return report

# ------------------- 5) Пример запуска из консоли -------------------
if __name__ == "__main__":
    print("===== AI АНАЛИТИК (JSON) — преобразование IT ТЗ в To-Do, оценку стоимости и сроков =====")
    title = input("Введите название проекта/задачи: ").strip()
    print("Вставьте текст ТЗ (несколько строк). Для окончания ввода введите пустую строку и Enter:")
    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line == "":
            break
        lines.append(line)
    spec = "\n".join(lines).strip()
    if not spec:
        print("ТЗ пустое — пожалуйста, запустите снова и вставьте текст технического задания.")
    else:
        try:
            result = analyst_agent_run(title, spec)
        except Exception as e:
            print("Ошибка при генерации:", e)
            raise

        print("\n\n========= PROJECT SUMMARY (JSON) =========\n")
        print(json.dumps(result["project"], ensure_ascii=False, indent=2))

        print("\n\n========= TASKS =========\n")
        for t in result["tasks"]:
            print(f"- {t['id']}: {t['title']} | {t.get('hours','?')} ч | роль: {t.get('role','?')} | зависит от: {t.get('depends_on',[])}")

        print("\n\n========= COST ESTIMATE =========\n")
        for item in result["cost_estimate"]["breakdown"]:
            print(f"- {item['id']}: {item['title'][:90]} | {item['hours']} ч | роль: {item['role']} | ставка: {item['rate']} | стоимость: {item['cost']}")
        print(f"\nИТОГО: {result['cost_estimate']['total']} (у.е.)")

        print("\n\n========= TIMELINE =========\n")
        print(f"Старт: {result['timeline_estimate']['project_start']}  — Окончание (оценочно): {result['timeline_estimate']['project_end']}")
        print(f"Рабочих дней (оценка): {result['timeline_estimate']['total_work_days']}")
        print("\nПодробный план по задачам:")
        for t in result['timeline_estimate']['task_schedule']:
            print(f"- {t['id']}: {t['title']} | роль: {t['role']} | {t['hours']}ч | {t['start_date']} — {t['end_date']} ({t['duration_days']} дн)")

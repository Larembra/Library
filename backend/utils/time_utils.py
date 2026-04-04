from datetime import datetime, timezone, timedelta

def get_moscow_now():
    """Returns current time in Moscow (UTC+3)"""
    return datetime.now(timezone(timedelta(hours=3)))

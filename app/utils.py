import jdatetime
from datetime import datetime, date, timezone
import pytz


def convert_to_shamsi(date_input):
    """تبدیل تاریخ میلادی به تاریخ شمسی"""
    if isinstance(date_input, datetime):
        date_input = date_input.date()
    elif isinstance(date_input, str):
        date_input = datetime.strptime(date_input, '%Y-%m-%d').date()
    if isinstance(date_input, date):
        jalali_date = jdatetime.date.fromgregorian(date=date_input)
        return jalali_date.strftime('%Y-%m-%d')
    return None


def convert_to_miladi(date_input, end_of_day=False):
    if date_input:
        shamsi_year, shamsi_month, shamsi_day = map(int, date_input.split('/'))
        miladi_date = jdatetime.date(
            shamsi_year, shamsi_month, shamsi_day).togregorian()
        if end_of_day:
            return datetime(miladi_date.year, miladi_date.month, miladi_date.day, 23, 59, 59, tzinfo=timezone.utc)
        else:
            return datetime(miladi_date.year, miladi_date.month, miladi_date.day, 0, 0, 0, tzinfo=timezone.utc)
    return None


def get_tehran_hour_minute(utc_datetime):
    """
    تبدیل زمان UTC به ساعت و دقیقه تهران
    
    پارامترها:
        utc_datetime (datetime): آبجکت datetime با منطقه زمانی UTC
        
    بازگشتی:
        str: ساعت و دقیقه تهران به فرمت 'HH:MM'
    """
    try:
        # اطمینان از اینکه زمان ورودی UTC است
        if utc_datetime.tzinfo != pytz.UTC:
            utc_datetime = utc_datetime.replace(tzinfo=pytz.UTC)
        
        # تبدیل به وقت تهران
        tehran_tz = pytz.timezone("Asia/Tehran")
        tehran_time = utc_datetime.astimezone(tehran_tz)
        
        return tehran_time.strftime("%H:%M")
    
    except Exception as e:
        raise ValueError(f"خطا در تبدیل زمان: {e}")
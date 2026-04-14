import os
from config import FILE_TYPES
from utils.file_utils import move_file
from db.json_db import add_record
from db.models import MoveRecord
from core.scanner import scan_directory

def get_category(ext: str):
    """根据扩展名返回分类名"""
    for category, exts in FILE_TYPES.items():
        if ext.lower() in exts:
            return category
    return "others"

def organize(path: str):
    """整理指定目录下的文件，并记录到 JSON 数据库"""
    # 1. 扫描目录，获取所有文件
    files = scan_directory(path)

    # 2. 逐个文件处理
    for file in files:
        ext = os.path.splitext(file)[1]  # 拿到扩展名，比如 ".jpg"
        category = get_category(ext)
        dst = os.path.join(path, category, os.path.basename(file))

        # 3. 移动文件
        move_file(file, dst)

        # 4. 记录到 JSON 数据库
        record = MoveRecord(src=file, dst=dst)
        add_record(record.__dict__)

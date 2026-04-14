import os
import shutil

def ensure_dir(path: str):
    """确保目录存在，不在则创建"""
    if not os.path.exists(path):
        os.makedirs(path)

def move_file(src: str, dst: str):
    ensure_dir(os.path.dirname(dst))
    shutil.move(src, dst)
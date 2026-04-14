import os

def scan_directory(path: str):
    """递归扫描目录，返回所有文件的完整路径列表"""
    files = []
    for root, dirs, filenames in os.walk(path):
        for name in filenames:
            files.append(os.path.join(root, name))
    return files
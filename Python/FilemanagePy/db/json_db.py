import json
import os
from config import DB_PATH

def load_db():
    """加载 JSON 数据库"""
    if not os.path.exists(DB_PATH):
        return {"records": []}
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f);

def save_db(data):
    """把数据写回 JSON 文件"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok = True)
    with open(DB_PATH, "w", encoding="utf-8") as f:
        # 参数 "w" 覆盖写入（因为 json 中的 data 是一整个 list，不能用add模式，只能在外部修改后重新写入）
        json.dump(data, f, indent=4, ensure_ascii=False)


"""正式操作部分"""
def add_record(record: dict):
    """向数据库中追加一条记录"""
    db = load_db()
    db["records"].append(record)
    save_db(db)
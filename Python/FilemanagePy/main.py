from core.organizer import organize
import os

def main():
    path = input("请输入要整理的目标路径: ").strip()
    if not path:
        print("路径不能为空")
        return

    if not os.path.exists(path):
        print("路径不存在，请检查后重试")
        return 

    organize(path)
    print("整理完成。记录已写入 data/db.json") 

if __name__ == "__main__":
    main()
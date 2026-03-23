import asyncio
from backend.database import SessionLocal
from backend.models.user import User
from backend.routers.users import get_my_comments

def main():
    db = SessionLocal()
    user = db.query(User).filter(User.id == 1).first()
    try:
        res = get_my_comments(user=user, db=db)
        print("OK", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

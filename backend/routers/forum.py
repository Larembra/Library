from typing import Optional, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.dependencies import get_db, get_current_user, get_current_admin, get_optional_user
from backend.models.forum import ForumTopic, ForumMessage, ForumMessageReaction
from backend.models.user import User
from backend.schemas.forum import ForumTopicCreate, ForumTopicOut, ForumMessageCreate, ForumMessageOut
from backend.schemas.review import ReactionRequest

router = APIRouter(prefix="/api/forum", tags=["forum"])


def _topic_to_out(topic: ForumTopic, db: Session) -> ForumTopicOut:
    author = db.query(User).filter(User.id == topic.author_id).first()
    replies_count = db.query(ForumMessage).filter(ForumMessage.topic_id == topic.id).count()
    return ForumTopicOut(
        id=topic.id,
        title=topic.title,
        author_id=topic.author_id,
        author_name=author.username if author else "",
        is_pinned=topic.is_pinned,
        is_locked=topic.is_locked,
        tag=topic.tag,
        replies_count=replies_count,
        last_activity=topic.last_activity,
        created_at=topic.created_at,
    )


def _message_to_out(msg: ForumMessage, db: Session, current_user: Optional[User] = None) -> ForumMessageOut:
    author = db.query(User).filter(User.id == msg.author_id).first()
    liked = False
    disliked = False
    if current_user:
        reaction = db.query(ForumMessageReaction).filter(
            ForumMessageReaction.message_id == msg.id,
            ForumMessageReaction.user_id == current_user.id,
        ).first()
        if reaction:
            liked = reaction.reaction_type == "like"
            disliked = reaction.reaction_type == "dislike"
    return ForumMessageOut(
        id=msg.id,
        topic_id=msg.topic_id,
        author_id=msg.author_id,
        author_name=author.username if author else "",
        author_avatar=author.avatar if author else "",
        author_role=author.role if author else "reader",
        content=msg.content,
        likes=msg.likes,
        dislikes=msg.dislikes,
        liked_by_user=liked,
        disliked_by_user=disliked,
        parent_id=msg.parent_id,
        created_at=msg.created_at,
    )


@router.get("/topics", response_model=List[ForumTopicOut])
def get_topics(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(ForumTopic)
    if search:
        query = query.filter(ForumTopic.title.ilike(f"%{search}%"))
    query = query.order_by(ForumTopic.is_pinned.desc(), ForumTopic.last_activity.desc())
    topics = query.offset((page - 1) * per_page).limit(per_page).all()
    return [_topic_to_out(t, db) for t in topics]


@router.get("/topics/{topic_id}")
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    messages = db.query(ForumMessage).filter(
        ForumMessage.topic_id == topic_id
    ).order_by(ForumMessage.created_at.asc()).all()
    return {
        "topic": _topic_to_out(topic, db),
        "messages": [_message_to_out(m, db, current_user) for m in messages],
    }


@router.post("/topics", response_model=ForumTopicOut)
def create_topic(
    data: ForumTopicCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    topic = ForumTopic(
        title=data.title,
        author_id=user.id,
        tag=data.tag or "Обсуждение",
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)

    # Create the first message
    msg = ForumMessage(
        topic_id=topic.id,
        author_id=user.id,
        content=data.content,
    )
    db.add(msg)
    db.commit()

    return _topic_to_out(topic, db)


@router.delete("/topics/{topic_id}")
def delete_topic(
    topic_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    db.delete(topic)
    db.commit()
    return {"message": "Тема удалена"}


@router.put("/topics/{topic_id}/pin")
def toggle_pin(
    topic_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    topic.is_pinned = not topic.is_pinned
    db.commit()
    return {"is_pinned": topic.is_pinned}


@router.post("/topics/{topic_id}/messages", response_model=ForumMessageOut)
def create_message(
    topic_id: int,
    data: ForumMessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    if topic.is_locked:
        raise HTTPException(status_code=403, detail="Тема закрыта для комментариев")

    msg = ForumMessage(
        topic_id=topic_id,
        author_id=user.id,
        content=data.content,
        parent_id=data.parent_id,
    )
    db.add(msg)
    topic.last_activity = datetime.utcnow()
    db.commit()
    db.refresh(msg)
    return _message_to_out(msg, db, user)


@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = db.query(ForumMessage).filter(ForumMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    if msg.author_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Нет прав на удаление")
    db.delete(msg)
    db.commit()
    return {"message": "Сообщение удалено"}


@router.post("/messages/{message_id}/react")
def react_to_message(
    message_id: int,
    data: ReactionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = db.query(ForumMessage).filter(ForumMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")

    existing = db.query(ForumMessageReaction).filter(
        ForumMessageReaction.message_id == message_id,
        ForumMessageReaction.user_id == user.id,
    ).first()

    if existing:
        if existing.reaction_type == data.reaction_type:
            if data.reaction_type == "like":
                msg.likes = max(0, msg.likes - 1)
            else:
                msg.dislikes = max(0, msg.dislikes - 1)
            db.delete(existing)
        else:
            if existing.reaction_type == "like":
                msg.likes = max(0, msg.likes - 1)
                msg.dislikes += 1
            else:
                msg.dislikes = max(0, msg.dislikes - 1)
                msg.likes += 1
            existing.reaction_type = data.reaction_type
    else:
        if data.reaction_type == "like":
            msg.likes += 1
        else:
            msg.dislikes += 1
        db.add(ForumMessageReaction(message_id=message_id, user_id=user.id, reaction_type=data.reaction_type))

    db.commit()
    return {"likes": msg.likes, "dislikes": msg.dislikes}

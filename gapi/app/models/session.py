#!/usr/bin/env python

from datetime import datetime, timedelta
import hashlib
from sqlalchemy import BigInteger, Column, String, ForeignKey, TIMESTAMP, func
from app.models import db, Base, Account
from app.utils import new_id

class Session(Base):
    __tablename__ = 'session'

    id = Column(BigInteger, primary_key = True)
    accountid = Column(BigInteger, ForeignKey("account.id"))
    wechat_session_key = Column(String(64), nullable=True)
    token = Column(String(64), index=True)
    expired_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    @classmethod
    def update_or_create_session(cls, account_id, session_key, expires_in):
        session = db.session.query(cls).filter(cls.accountid == account_id).first()
        if not session:
            session = Session(
                accountid = account_id,
                wechat_session_key = session_key,
                token = hashlib.sha256(new_id()).hexdigest(),
                expired_at = datetime.now() + timedelta(seconds=expires_in)
            )
            db.session.add(session)
            db.session.commit()
        else:
            session.wechat_session_key = session_key,
            session.token = hashlib.sha256(new_id()).hexdigest()
            session.expired_at = datetime.now() + timedelta(seconds=expires_in)
            db.session.commit()
        return session

    @classmethod
    def check_session(cls, session_hash):
        session = db.session.query(cls).filter(cls.token == session_hash, cls.expired_at >= datetime.now()).first()
        if not session:
            return None, None
        account = db.session.query(Account).filter(Account.id == session.accountid).first()
        return account, session

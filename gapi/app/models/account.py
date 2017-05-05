import datetime
import hashlib
import simplejson as json
from sqlalchemy import BigInteger, Boolean, Column, DateTime, String, Integer, Text, LargeBinary, ForeignKey, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from app.models import Base

class Account(Base):
    __tablename__ = 'account'

    id = Column(BigInteger, primary_key = True)
    username = Column(String(64), nullable=True)
    wx_liteapp_openid = Column(String(64))
    phone = Column(String(64), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    @classmethod
    def get_or_create_by_liteapp_openid(cls, openid):
        if not openid:
            return None
        account = db.session.query(cls).filter(cls.wx_liteapp_openid == openid).first()
        if not account:
            account = Account()
            account.wx_liteapp_openid = openid
            db.session.add(account)
            db.session.commit()
        return account

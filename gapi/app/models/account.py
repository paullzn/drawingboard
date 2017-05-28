from sqlalchemy import BigInteger, Column, String, TIMESTAMP, func
from app.models import db, Base

class Account(Base):
    __tablename__ = 'account'

    id = Column(BigInteger, primary_key = True)
    username = Column(String(64), nullable=True)
    wechat_liteapp_openid = Column(String(64))
    app_name = Column(String(64))
    phone = Column(String(64), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    @classmethod
    def get_or_create_by_liteapp_openid(cls, app_name, openid):
        if not openid:
            return None
        account = db.session.query(cls).filter(cls.app_name == app_name, cls.wechat_liteapp_openid == openid).first()
        if not account:
            account = Account()
            account.app_name = app_name
            account.wechat_liteapp_openid = openid
            db.session.add(account)
            db.session.commit()
        return account

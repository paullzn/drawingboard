import datetime
import hashlib
import simplejson as json
from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, Text, LargeBinary, ForeignKey, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from app.models import Base

class Feedback(Base):
    __tablename__ = 'feedback'

    id = Column(BigInteger, primary_key = True)
    accountid = Column(BigInteger, ForeignKey("account.id"), nullable=False)
    content = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())


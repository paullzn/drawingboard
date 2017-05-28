#!/usr/bin/env python
# coding: utf-8

from sqlalchemy import BigInteger, Column, String, Text, DECIMAL, TIMESTAMP, func, ForeignKey
from app.models import db, Base

class Eyes(Base):
    __tablename__ = 'eyes'

    id = Column(BigInteger, primary_key = True)
    accountid = Column(BigInteger, ForeignKey("account.id"), nullable=False)
    image_id = Column(String(256), nullable=False)
    image_info = Column(Text, nullable=False)
    rating = Column(DECIMAL(6, 2), index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    @classmethod
    def getRank(cls, rating):
        belowCount = db.session.query(cls).filter(cls.rating < rating).count()
        totalCount = db.session.query(cls).count()
        return belowCount, totalCount

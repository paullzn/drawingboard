import datetime
import hashlib
import simplejson as json
from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, String, Integer, Text, LargeBinary, ForeignKey, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from app.models import Base

class Artwork(Base):
    __tablename__ = 'artwork'

    id = Column(BigInteger, primary_key = True)
    accountid = Column(BigInteger, ForeignKey("account.id"), nullable=False)
    artwork_id = Column(String(64))
    created_at = Column(TIMESTAMP, server_default=func.now())
    modified_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    @classmethod
    def create_unless_exists(cls, account_id, artwork_id):
        artwork = db.session.query(cls).filter(cls.accountid == account_id, cls.artwork_id == artwork_id)
        if artwork:
            artwork.modified_at = datetime.now()
            db.session.commit()
        else:
            artwork = Artwork()
            artwork.accountid = account_id
            artwork.artwork_id = artwork_id
            db.session.add(artwork)
            db.session.commit()


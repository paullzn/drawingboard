# coding: utf-8

from app.models.quota import (
    DEFAULT_QUOTA_QUANTITY,
    Quota
)
from app.libs.db import session


def init_quota():
    for kind, quantity in DEFAULT_QUOTA_QUANTITY:
        Quota.create(kind, quantity)
        session.commit()


def main():
    init_quota()

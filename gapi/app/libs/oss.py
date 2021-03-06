#!/usr/bin/env python

import config
import oss2
from app.exc import RespArtworkNotFound
from logging import getLogger

log = getLogger(__name__)

def put(name, content, bucket_name=config.ALIYUN_OSS_BUCKET):
    bucket = oss2.Bucket(oss2.Auth(
        config.ALIYUN_OSS_ACCESS_KEY,
        config.ALIYUN_OSS_ACCESS_SECRET),
        config.ALIYUN_OSS_INTERNAL_HOST if config.ENV == 'prod' else config.ALIYUN_OSS_EXTERNAL_HOST,
        bucket_name)
    bucket.put_object(name, content)

def get(name, bucket_name=config.ALIYUN_OSS_BUCKET):
    bucket = oss2.Bucket(oss2.Auth(
        config.ALIYUN_OSS_ACCESS_KEY,
        config.ALIYUN_OSS_ACCESS_SECRET),
        config.ALIYUN_OSS_INTERNAL_HOST if config.ENV == 'prod' else config.ALIYUN_OSS_EXTERNAL_HOST,
        bucket_name)
    try:
        return bucket.get_object(name).read()
    except oss2.exceptions.NoSuchKey as e:
        log.error(u'Already deleted request_id={0}'.format(e.request_id))
        raise RespArtworkNotFound()

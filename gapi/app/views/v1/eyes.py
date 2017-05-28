#!/usr/bin/env python
# coding: utf-8

import time, uuid
from logging import getLogger

from flask import request, g
from flask_restful import Resource

from app import create_app
from app.models import db, Eyes
from app.backends import Facepp
from base import api_method
from app.libs import oss

import config
import simplejson as json

log = getLogger(__name__)

api = create_app().api

HINT_TEXT = u"为了准确定位分析您的双眼，请保证整脸都在照片内"
FOOTER_TEXT = u"意见和反馈 请发邮件至 paullzn@163.com"
class EyesAPI(Resource):

    @api_method(task='eyes', login_required=True)
    def post(self):
        """
        @image file image of the eyes
        return {
            image: <croped & enhanced base64 eyes image>,
            firstLine: <firstLine to display on App>,
            secondLine: <secondLine to display on App>,
            buttonText: <button text to display on App>,
            footerText: <text to display on App bottom>
        }
        """
        if 'image' not in request.files:
            belowCount, totalCount = Eyes.getRank(0)
            return {
                "firstLine": u"已有 {} 人次".format(totalCount),
                "secondLine": u"参与过评分",
                "buttonText": u"点击自拍",
                "hintText": HINT_TEXT,
                "footerText": FOOTER_TEXT

            }
        print g.account.id
        image_id = 'eyes-{}-{}-{}'.format(int(time.time()), g.account.id, uuid.uuid4())
        oss.put(image_id, request.files.get('image'), config.ALIYUN_EYES_OSS_BUCKET)

        face_info = Facepp.detect(request.files.get('image'))
        if face_info['face_count'] < 0:
            return {
                "firstLine": u"很抱歉",
                "secondLine": u"人脸检测失败",
                "buttonText": u"再试一次",
                "hintText": HINT_TEXT,
                "footerText": FOOTER_TEXT
            }
        eyes = Eyes(accountid=g.account.id, image_id=image_id,
                    image_info = json.dumps(face_info),
                    rating=face_info['rating'])
        db.session.add(eyes)
        db.session.commit()
        belowCount, totalCount = Eyes.getRank(face_info['rating'])
        rank = Facepp.rankByCounts(belowCount, totalCount)
        return {
            "firstLine": "Rating: {}".format(face_info['rating']),
            "secondLine": u"超过了 {}% 的人".format(rank),
            "buttonText": u"再来一次",
            "hintText": HINT_TEXT,
            "footerText": FOOTER_TEXT
        }

api.add_resource(EyesAPI, '/api/v1/eyes')

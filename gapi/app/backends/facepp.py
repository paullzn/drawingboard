#!/usr/bin/env python
# encoding: utf-8

import config
import requests
import simplejson as json

FACEPP_API_DETECT = 'https://api-cn.faceplusplus.com/facepp/v3/detect'

class Facepp(object):
    @classmethod
    def _calculateRating(cls, result):
        face_count = len(result['faces'])
        max_face_size = 0

        if face_count == 0:
            return {
                'face_count': 0
            }

        if face_count > 1:
            for face in result['faces']:
                if face['face_rectangle']['width'] * face['face_rectangle']['height'] > max_face_size:
                    face_attr = face['attributes']
                    max_face_size = face['face_rectangle']['width'] * face['face_rectangle']['height']
        else:
            face_attr = result['faces'][0]['attributes']

        #gender, baseline: male 80, female 88
        if face_attr['gender']['value'] == 'Male':
            rating = 80
        else:
            rating = 88

        #age, 21-> +3, 41 -> 0, 61 -> -6
        age = face_attr['age']['value']
        rating += (20 - abs(age - 21)) / 20. * 3

        #blur, -10 ~ 0
        rating -= face_attr['blur']['blurness']['value'] / face_attr['blur']['blurness']['threshold'] * 10

        #smile, 0 ~ +2
        rating += face_attr['smile']['value'] / face_attr['smile']['threshold'] * 2

        #face_quality, +3
        rating += (face_attr['facequality']['value'] - face_attr['facequality']['threshold']) / (100 - face_attr['facequality']['threshold']) * 3

        #ethnicity, not asian + 2
        if face_attr['ethnicity'] != 'Asian':
            rating += 2

        #eyestatus, half value!
        max_value = {}
        eye_status = {}
        for eye in face_attr['eyestatus']:
            max_value[eye] = -1
            for status in face_attr['eyestatus'][eye]:
                value = face_attr['eyestatus'][eye][status]
                if value > max_value[eye]:
                    max_value[eye] = value
                    eye_status[eye] = status
            if eye_status in ['dark_glasses', 'no_glass_eye_close', 'occlusion', 'normal_glass_eye_close']:
                rating /= 1.5
            elif eye_status in ['normal_glass_eye_open']:
                rating /= 1.1

        return {
            'face_count': face_count,
            'rating': rating
        }

    @classmethod
    def detect(cls, image):
        image.seek(0)
        result = requests.post(FACEPP_API_DETECT, {
            'api_key': config.FACEPP_KEY,
            'api_secret': config.FACEPP_SECRET,
            'return_attributes': 'gender,age,smiling,facequality,blur,eyestatus,ethnicity'
        }, files={'image_file': image}).json()
        print json.dumps(result)
        return cls._calculateRating(result)

    @classmethod
    def rankByCounts(cls, belowCount, totalCount):
        return int(1. * belowCount / totalCount * 10000) / 100.

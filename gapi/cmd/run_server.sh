#!/bin/bash -e

. venv/bin/activate
export LC_ALL=en_US.UTF-8
exec venv/bin/python venv/bin/gunicorn -b "0.0.0.0:80" -w 5 "app:create_app('config')" -k "gevent" --access-logformat '%(t)s %(h)s %(l)s %(u)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s' --log-level=DEBUG --timeout=60

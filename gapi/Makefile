VENV = venv
PYTHON = $(VENV)/bin/python

PIP = $(VENV)/bin/pip

PIP_INSTALL = $(PIP) install --quiet

gulp = ./web/node_modules/.bin/gulp

gulpfile = ./web/gulpfile.js

deps:
	@$(PIP_INSTALL) -r requirements.txt -i http://pypi.douban.com/simple/

venv:
	@virtualenv $(VENV) --prompt '<venv:ogre>'
	@$(PIP_INSTALL) -U pip setuptools

clean:
	@find . -not \( -path './venv' -prune \) -name '*.pyc' -exec rm -f {} \;
	@find . -not \( -path './venv' -prune \) -name '*~' -exec rm -f {} \;

server: clean_pyc
	$(PYTHON) manage.py server

db:
	$(PYTHON) manage.py createdb

init:
	$(PYTHON) manage.py init

test:
	PYTHONPATH=. $(PYTHON) tests/test.py

deploy_staging:
	$(PYTHON) manage.py deploy staging

deploy_prod:
	$(PYTHON) manage.py deploy prod

npm:
	@npm install --prefix ./web

gulp: npm
	$(gulp) --gulpfile $(gulpfile)

web_staging: gulp
	./cmd/deploy_static.sh staging v1.0.1

web_prod: gulp
	./cmd/deploy_static.sh prod v1.0.1

clean_redis:
	$(PYTHON) manage.py clean_redis

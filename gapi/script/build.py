# coding: utf-8

import sys
from datetime import datetime

from utils import cd, run


setting = {
    'jenkins_env_root': '/pyenvs/ogre',
    'name': 'ogre',
}


def make_package(package):
    print 'building {} make_package..'.format(package)
    clean()

    if package == 'pkg_staging':
        run("cp -rf app/cert_staging/* app/cert")

    if package == 'pkg_staging_mock_test':
        run("cp -rf app/cert_staging/* app/cert")
        run("cp -rf app/mock_tests/backends/* app/backends")

    run("rm -rf app/cert_staging")
    run("cp -r app build/")
    run("cp -r cmd build/")
    run("cp -r script build/")
    run("cp -r tests build/")
    run("cp *.py build/")
    run("cp *.txt build/")
    run("cp Makefile build/")

    with cd("build/"):
        run("rm -rf venv")
        run("cp -r %s venv" % setting['jenkins_env_root'])
        run("venv/bin/pip install -r requirements.txt -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com")
        run("venv/bin/pip install -U -r vcs_requirements.txt -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com")
        run("virtualenv --relocatable venv")

    current = datetime.now().strftime("%Y%m%d%H%M%S")
    run("tar zcvf {}-{}-{}.tar.gz build".format(setting["name"], package, current))
    print 'build for staging success!!!'


def clean():
    run("rm -rf build", retry=2)
    run("rm -rf *.tar.gz")
    run("mkdir -p build")


if __name__ == '__main__':
    pack = sys.argv[1]
    assert pack in ('pkg_prod', 'pkg_staging', 'pkg_staging_mock_test')
    make_package(pack)

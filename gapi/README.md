# ogre

## 简介：芝麻认证sdk代码

## [文档](http://wiki.megvii-inc.com/pages/viewpage.action?pageId=6324293)

## 后端

### 开发环境的依赖:

1. Python pip
2. Python virtualenv
3. MySQL
4. redis

### 构建本地开发环境

1. `git clone git@git-pd.megvii-inc.com:cloudDEV/ogre.git`

2. `cd ogre`

3. `git checkout develop`

4. `make venv`

5. `source venv/bin/activate`

6. `make deps` 安装后端依赖

7. `mysql -uroot -p` 进入本地mysql

8. `create database ogre;` 创建mysql数据库

9. `make db` &% `make init`

10. `make server` 启动后端服务


### 部署

1. `make deploy_staging`  # 部署到staging


## 前端

## 打包

1. `make gulp`

### Development Workflow

1. `git fetch origin` # 更新本地 repo
2. `git checkout -b $YOUR_DEV_BRANCH origin/master`  # create your dev branch from origin/master
3.  Write code and commit it
4. `git push origin HEAD`
5. `python manage.py deploy -e test -b $YOUR_DEV_BRANCH`  # deploy web staging from your code
6. Test it by **yourself** and QA
7. [New a merge request to **master** branch](https://git-pd.megvii-inc.com/cloudDEV/ogre) and **code review**
8. `python manage.py deploy -e prod -b master`  # deploy web prod

### install m2crypto

#### macos

* `brew install openssl`
* `brew install swig`
* `env LDFLAGS="-L$(brew --prefix openssl)/lib" \
CFLAGS="-I$(brew --prefix openssl)/include" \
SWIG_FEATURES="-cpperraswarn -includeall -I$(brew --prefix openssl)/include" \
`

#### linux

* `SWIG`
* `pip install m2crypto==0.25.1`
* `ln -s /usr/local/lib/python2.7/dist-packages/M2Crypto/__m2crypto.so venv/lib/python2.7/site-packages/M2Crypto/__m2crypto.so -f # 这步可以在falcon中prestart调用`


### 本地测试

1. `make test`  # 进行单元测试


### 远端压力测试

1. update scripts.deploy `pkg_staging` => `pkg_staging_mock_test` 

2. 部署压测代码到与上线环境 `python manage.py deploy -e test -b develop`

3. 登录另一台阿里云开发机作为`压测客户端`, 安装压测工具 `sudo pip install locustio`

4. 执行压测命令，`locust -f concurrency.py -H 'http://x.x.x.x:p'`

5. 浏览器中访问http://{压测客户端}:8089, 修改并发参数，查看并发上线

6. [压力测试结果](http://wiki.megvii-inc.com/pages/viewpage.action?pageId=7766472)

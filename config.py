import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    APP_NAME = 'Freedomap'
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECONNECT = 1000
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379'
    # ClearDB's idle limit is 90 seconds, so set the recycle to be under 90
    if os.environ.get('DATABASE_URL'):
        SQLALCHEMY_POOL_SIZE = 3
        SQLALCHEMY_POOL_RECYCLE = 55
        SQLALCHEMY_POOL_TIMEOUT = 5

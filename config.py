import os

class Config:
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'yourusername'
    MYSQL_PASSWORD = 'yourpassword'
    MYSQL_DB = 'f1telemetry'
    MYSQL_CURSORCLASS = 'DictCursor'
    CACHE_DIR = os.path.join(os.getcwd(), 'cache')

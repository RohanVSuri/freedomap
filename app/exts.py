# import wtforms_json
from flask_caching import Cache
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate(db=db)
cache = Cache()
# oauth = OAuth()
csrf = CSRFProtect()
# wtforms_json.init()

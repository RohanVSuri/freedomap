from flask import Flask, render_template, flash, jsonify
from app import map as map_blueprint
from app.exts import db, migrate
from config import Config


def create_app(config_name=Config):
    app = Flask(__name__.split('.')[0])
    app.config.from_object(config_name)


    # Register before requests mixins prior to those that are inside extensions
    register_extensions(app)
    register_url_rules(app)
    register_blueprints(app)
    register_errorhandlers(app)
    app.shell_context_processor(lambda: {
        'db': db, 'Protest': map_blueprint.models.Protest,
    })

    return app


def register_extensions(app):
    db.init_app(app)
    with app.app_context():
        if db.engine.url.drivername == 'sqlite':
            migrate.init_app(app, db, render_as_batch=True)
        else:
            migrate.init_app(app, db)
    # csrf.init_app(app)
    # cache.init_app(app, config=app.config)


def register_blueprints(app):
    app.register_blueprint(map_blueprint.views.bp)


def register_errorhandlers(app):
    app.register_error_handler(404, lambda _: (render_template('404.html'), 404))
    # app.register_error_handler(CSRFError, lambda error: (jsonify({'reason': error.description}), 400))

    def internal_error(error):
        db.session.rollback()
        flash('Internal Error: Try refreshing')
        return render_template('500.html'), 500

    app.register_error_handler(500, internal_error)


def register_url_rules(app: Flask):
    @app.route('/')
    def main():
        return render_template('index.html')


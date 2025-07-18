import os
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from mail_service import mail, init_mail

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Database model base
class Base(DeclarativeBase):
    pass

# Initialize extensions
db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///sierrawings.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions with app
db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access this page.'
init_mail(app)

# User loader
@login_manager.user_loader
def load_user(user_id):
    from models import User  # Make sure models.py exists!
    return User.query.get(int(user_id))

# Home route
@app.route("/")
def home():
    return render_template('index.html')  # Make sure templates/index.html exists!

# Register blueprints
def register_blueprints():
    from auth import bp as auth_bp
    from admin import bp as admin_bp
    from hospital import bp as hospital_bp
    from routes_announcement import announcement_bp
    from routes_voice_checklist import voice_checklist
    from routes_feedback import feedback_bp
    import routes_updates

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(hospital_bp, url_prefix='/hospital')
    app.register_blueprint(announcement_bp)
    app.register_blueprint(voice_checklist)
    app.register_blueprint(feedback_bp)

# Init DB and blueprints
with app.app_context():
    import models
    import models_extensions
    db.create_all()
    register_blueprints()
    logging.info("SierraWings initialized successfully.")

# Run app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

from app.map.models import ProtestSubmission
from flask import Blueprint, render_template
from flask.json import jsonify


bp = Blueprint('map', 'map', url_prefix='/map', static_folder='/static', template_folder='/static')

@bp.route('/', methods=['GET'])
def map():
    return render_template('map.html')

@bp.route('/panel', methods=['GET'])
def panel():
    return render_template('panel.html')

@bp.route('protest-submission', methods=['GET'])
def protest_submissions():
    return jsonify(ProtestSubmission.query.all())
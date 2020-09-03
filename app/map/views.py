from flask import Blueprint, render_template


bp = Blueprint('map', 'map',static_folder='/static', template_folder='/static')

@bp.route('/map', methods=['GET'])
def map():
    return render_template('map.html')

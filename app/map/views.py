from app.map.forms import ProtestSubmissionForm
from app.map.models import Protest, ProtestSubmission
from flask import Blueprint, render_template, request
from flask.json import jsonify
from app.exts import db


bp = Blueprint(
    "map", "map", url_prefix="/map", static_folder="/static", template_folder="/static"
)


@bp.route("/", methods=["GET"])
def map():
    return render_template("map.html")


@bp.route("protest-submission", methods=["GET", "POST"])
def protest_submissions():
    if request.method == "GET":
        return jsonify([submission.to_json() for submission in ProtestSubmission.query.all()])
    else:
        form = ProtestSubmissionForm()
        if form.validate_on_submit():
            protest_submission = ProtestSubmission(
                address=form.address.data, lat=form.lat.data, lng=form.lng.data, description=form.description.data, size=form.size.data, issue_locality=form.issue_locality.data, issue_type=form.issue_type.data, 
            )
            db.session.add(protest_submission)
            db.session.commit()
            return jsonify(protest_submission.to_json()), 200
        return jsonify(form.errors), 400

@bp.route("protests", methods=["GET"])
def protests():
    return jsonify([protest.to_json() for protest in Protest.query.all()])

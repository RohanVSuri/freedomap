from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField, FieldList
from wtforms.validators import Length

class ProtestSubmissionForm(FlaskForm):
    class Meta:
        csrf = False
    address = StringField('address')
    # lat and lng are hidden to the user on the ui 
    lat = FloatField('latitude')
    lng = FloatField('longitude')
    description = StringField()
    size = IntegerField()
    issue_locality = StringField()
    issue_type = StringField()
    
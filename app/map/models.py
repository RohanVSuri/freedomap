from app.exts import db

class Protest(db.Model):
    __tablename__ = 'protest'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lat = db.Column(db.Float(7))
    lng = db.Column(db.Float(7))
    submissions = db.relationship('ProtestSubmission', backref='protest', lazy='dynamic')

# Option to submit either address which gets converted to lang lat for heatmap orrr....
# Option to allow location data so we just pull their exact gps location

# Protest Submissions are created by users who see a protest at their current location.
# The lat and lng attributes should be their own location, or somewhere close to them

class ProtestSubmission(db.Model):
    __tablename__ = 'protestsubmission'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    address = db.Column(db.String(200))
    # lat and lng are hidden to the user on the ui 
    lat = db.Column(db.Float(7))
    lng = db.Column(db.Float(7))
    description = db.Column(db.String(120))
    # type = db.Column(db.)

    # local issue, national issue, racial issue, governmental overreach, custom 


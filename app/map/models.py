from app.exts import db
import datetime


class Protest(db.Model):
    __tablename__ = "protest"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lat = db.Column(db.Float(7))
    lng = db.Column(db.Float(7))
    submissions = db.relationship(
        "ProtestSubmission", backref="protest", lazy="dynamic"
    )

    def to_json(self):
        return {
            'id': self.id,
            'lat': self.lat,
            'lng': self.lng,
            'submissions': [submission.to_json() for submission in self.submissions]
        }



# Option to submit either address which gets converted to lang lat for heatmap orrr....
# Option to allow location data so we just pull their exact gps location

# Protest Submissions are created by users who see a protest at their current location.
# The lat and lng attributes should be their own location, or somewhere close to them


class ProtestSubmission(db.Model):
    __tablename__ = "protestsubmission"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    protest_id = db.Column(db.Integer, db.ForeignKey("protest.id"))
    address = db.Column(db.String(200))
    # lat and lng are hidden to the user on the ui
    lat = db.Column(db.Float(7))
    lng = db.Column(db.Float(7))
    description = db.Column(db.String(120))
    size = db.Column(db.String(120))
    issue_locality = db.Column(db.String(120))
    issue_type = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_json(self):
        return {
            'id': self.id,
            'protest_id': self.protest_id,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
            'description': self.description,
            'size': self.size,
            'issue_locality': self.issue_locality,
            'issue_type': self.issue_type.split(',') if self.issue_type else []
        }

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DECIMAL, Integer

Model = declarative_base()

class Protest(Model):
    __tablename__ = 'protest'
    id = Column(Integer, primary_key=True, autoincrement=True)
    lat = Column(DECIMAL)
    lng = Column(DECIMAL)

# Option to submit either address which gets converted to lang lat for heatmap orrr....
# Option to allow location data so we just pull their exact gps location

# Protest Submissions are created by users who see a protest at their current location.
# The lat and lng attributes should be their own location, or somewhere close to them

class ProtestSubmission(Model):
    __tablename__ = 'protestsubmission'
    id = Column(Integer, primary_key=True, autoincrement=True)
    lat = Column(DECIMAL)
    lng = Column(DECIMAL)

from app.app import create_app

app = create_app()
app.app_context().push()

from app.exts import db

from app.map.models import Protest, ProtestSubmission
from datetime import datetime, timedelta
from geopy.distance import distance
from collections import defaultdict

PROTEST_RADIUS = 5  # miles

def create_protests():
    protest_dict = defaultdict(list)

    visited = set()

    submission1: ProtestSubmission
    for submission1 in ProtestSubmission.query.all():
        submission2: ProtestSubmission
        for submission2 in ProtestSubmission.query.all():
            submission1_latlng = (submission1.lat, submission1.lng)
            submission2_latlng = (submission2.lat, submission2.lng)

            if submission1_latlng == submission2_latlng:
                continue

            if distance(submission1_latlng, submission2_latlng).miles < PROTEST_RADIUS:
                if len(protest_dict[submission1_latlng]) != 0 and submission2_latlng not in visited:
                    protest_dict[submission1_latlng].append(submission2)
                elif len(protest_dict[submission2_latlng]) != 0 and submission1_latlng not in visited:
                    protest_dict[submission2_latlng].append(submission1)
                elif submission1_latlng not in visited and submission2_latlng not in visited:
                    protest_dict[submission1_latlng].append(submission1)
                    protest_dict[submission1_latlng].append(submission2)
                
                visited.add(submission1_latlng)
                visited.add(submission2_latlng)

    new_protests = []
    for submissions in protest_dict.values():
        if len(submissions) == 0:
            continue

        latitudes = [submission.lat for submission in submissions]
        longitudes = [submission.lng for submission in submissions]

        avg_lat = sum(latitudes) / len(latitudes)
        avg_lng = sum(longitudes) / len(longitudes)

        new_protests.append(Protest(lat=avg_lat, lng=avg_lng, submissions=submissions))

    for protest in Protest.query.all():
        db.session.delete(protest)
    
    for protest in new_protests:
        db.session.add(protest)
    
    db.session.commit()

def drop_stale_submissions():
    for submission in ProtestSubmission.query.all():
        if datetime.utcnow() - submission.timestamp > timedelta(hours=24):
            db.session.delete(submission)
    db.session.commit()
    
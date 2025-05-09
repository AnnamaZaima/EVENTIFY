class Club:
    def __init__(self, username, password, club_name=None, club_email=None):
        self.username = username
        self.password = password
        self.club_name = club_name
        self.club_email = club_email


class Event:
    def __init__(self, event_id, event_name, username, details, event_date, event_link):
        self.event_id = event_id
        self.event_name = event_name
        self.username = username
        self.details = details
        self.event_date = event_date
        self.event_link = event_link


class Fest:
    def __init__(self, event_id, time, title, details, location):
        self.event_id = event_id
        self.time = time
        self.title = title
        self.details = details
        self.location = location


class Competition:
    def __init__(self, event_id, time, title, details, location, enroll):
        self.event_id = event_id
        self.time = time
        self.title = title
        self.details = details
        self.location = location
        self.enroll = enroll


class Seminar:
    def __init__(self, event_id, registration, time, title, details, location):
        self.event_id = event_id
        self.registration = registration
        self.time = time
        self.title = title
        self.details = details
        self.location = location


class User:
    def __init__(self, gsuite, user_id=None):
        self.gsuite = gsuite
        self.user_id = user_id


class Attend:
    def __init__(self, event_id, gsuite_

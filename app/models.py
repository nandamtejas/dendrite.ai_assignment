from mongoengine import Document, StringField, DateTimeField, ImageField, BooleanField
from datetime import datetime


class Todo(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    time = DateTimeField(required=True, default=datetime.now(), format="%d-%m-%Y %H:%M:%S")
    username = StringField()
    is_subscribed = BooleanField(required=True, default=False)
    image = ImageField()
    createdAt = DateTimeField(default=datetime.now())
    updatedAt = DateTimeField()
    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "time": self.time,
        }
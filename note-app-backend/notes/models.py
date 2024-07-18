from django.db import models

class Note(models.Model):
    title = models.TextField()
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:50]
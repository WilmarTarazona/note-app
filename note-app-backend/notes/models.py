from django.db import models

class Note(models.Model):
    title = models.TextField()
    body = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content[:50]
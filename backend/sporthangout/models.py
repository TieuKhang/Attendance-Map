from django.db import models

# Create your models here.

class Sporthangout(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title

class LocationInfo(models.Model):
    name = models.TextField()
    attendance = models.IntegerField()
    lat = models.CharField(max_length=120,default=False)
    lot = models.CharField(max_length=120,default=False)
    
    def _str_(self):
        return self.name


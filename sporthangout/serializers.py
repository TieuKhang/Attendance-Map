from rest_framework import serializers
from .models import Sporthangout
from .models import LocationInfo

class SporthangoutSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True
        model = Sporthangout
        fields = ('id', 'title', 'description', 'completed')

class LocationinfoSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True
        model = LocationInfo
        fields = ('id', 'name', 'attendance', 'lat','lot')
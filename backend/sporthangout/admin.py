from django.contrib import admin
from .models import Sporthangout
from .models import LocationInfo

class SporthangoutAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

class LocationinfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'attendance', 'lat','lot')

# Register your models here.

admin.site.register(Sporthangout, SporthangoutAdmin)
admin.site.register(LocationInfo, LocationinfoAdmin)
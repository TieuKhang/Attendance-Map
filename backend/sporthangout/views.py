from email import message
from django.shortcuts import render
from chatbot.chat import chatWithBot
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import SporthangoutSerializer
from .models import Sporthangout
from .serializers import LocationinfoSerializer
from .models import LocationInfo

# Create your views here.

class SporthangoutView(viewsets.ModelViewSet):
    serializer_class = SporthangoutSerializer
    queryset = Sporthangout.objects.all()

class LocationinfoView(viewsets.ModelViewSet):
    serializer_class = LocationinfoSerializer
    queryset = LocationInfo.objects.all()

@api_view(['POST'])
def aiChatBot(request):
    if request.method == 'POST':
        botResponse = chatWithBot(request.data.get("message"))
        return Response({"message": botResponse})

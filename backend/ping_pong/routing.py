from django.urls import re_path
from ping_pong import consumers


pong_urlpatterns = [
    re_path('ws/ping_pong', consumers.GameClient.as_asgi()),
]

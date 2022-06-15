"""Wordle URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Wordle_game import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home),
    path('Rules',views.rules),
    path('home',views.home),
    path('test', views.test),
    path('api/word_check',views.ajax_wordcheck),
    path('api/word_get',views.ajax_wordget),
    path('api/point',views.ajax_point),
    path('api/result',views.ajax_result),
]

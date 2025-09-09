from django.urls import path
from .views import createtodo, updatetodo, cleartodo,viewalltasks

urlpatterns = [
    path('createtodo/', createtodo, name='createtodo'),
    path('updatetodo/<int:id>/', updatetodo, name='updatetodo'),
    path('cleartodo/<int:id>/', cleartodo, name='cleartodo'),
    path('viewalltasks/', viewalltasks, name='viewalltasks'),
]
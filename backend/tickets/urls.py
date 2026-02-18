from django.urls import path
from .views import TicketListCreateView, TicketUpdateView


urlpatterns = [
    # List all tickets & create new ticket
    path("tickets/", TicketListCreateView.as_view()),

    # Retrieve / update specific ticket by ID
    path("tickets/<int:pk>/", TicketUpdateView.as_view()),
]

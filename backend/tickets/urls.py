from django.urls import path
from .views import TicketListCreateView, TicketUpdateView, TicketStatsView


urlpatterns = [
    # Ticket statistics endpoint (DB-level aggregation)
    path("tickets/stats/", TicketStatsView.as_view()),

    # List all tickets & create new ticket
    path("tickets/", TicketListCreateView.as_view()),

    # Retrieve / update specific ticket by ID
    path("tickets/<int:pk>/", TicketUpdateView.as_view()),

]

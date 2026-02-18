from django.urls import path
from .views import (
    TicketListCreateView,
    TicketUpdateView,
    TicketStatsView,
    TicketClassifyView
)

urlpatterns = [

    # -------------------------------
    # List & Create Tickets
    # GET  -> List all tickets
    # POST -> Create new ticket
    # Supports filtering & search
    # -------------------------------
    path("tickets/", TicketListCreateView.as_view()),


    # -------------------------------
    # Retrieve / Update Single Ticket
    # GET    -> Retrieve ticket by ID
    # PUT    -> Full update
    # PATCH  -> Partial update
    # -------------------------------
    path("tickets/<int:pk>/", TicketUpdateView.as_view()),


    # -------------------------------
    # Ticket Statistics Endpoint
    # Uses DB-level aggregation (Count, Avg, TruncDate)
    # GET -> /api/tickets/stats/
    # -------------------------------
    path("tickets/stats/", TicketStatsView.as_view()),


    # -------------------------------
    # LLM Classification Endpoint
    # POST -> Accept description
    # Calls OpenAI API
    # Returns suggested category + priority
    # -------------------------------
    path("tickets/classify/", TicketClassifyView.as_view()),
]

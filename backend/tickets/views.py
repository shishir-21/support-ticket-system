from rest_framework import generics, filters
from .models import Ticket
from .serializers import TicketSerializer
from django_filters.rest_framework import DjangoFilterBackend


class TicketListCreateView(generics.ListCreateAPIView):
    """
    GET  -> List all tickets
    POST -> Create new ticket
    """

    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer

    # Enable filtering + searching
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "priority", "status"]
    search_fields = ["title", "description"]


class TicketUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET    -> Retrieve single ticket
    PUT    -> Full update
    PATCH  -> Partial update
    """

    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

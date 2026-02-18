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

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django.db.models import F
from django.db.models import FloatField
from django.db.models.functions import Cast


class TicketStatsView(APIView):

    def get(self, request):

        # Total tickets
        total_tickets = Ticket.objects.count()

        # Open tickets
        open_tickets = Ticket.objects.filter(status="open").count()

        # ---- Average tickets per day (PURE ORM) ----
        daily_counts = (
            Ticket.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
        )

        avg_data = daily_counts.aggregate(avg=Avg("count"))
        avg_per_day = avg_data["avg"] or 0

        # ---- Priority breakdown ----
        priority_data = (
            Ticket.objects
            .values("priority")
            .annotate(count=Count("id"))
        )

        priority_breakdown = {
            item["priority"]: item["count"]
            for item in priority_data
        }

        # ---- Category breakdown ----
        category_data = (
            Ticket.objects
            .values("category")
            .annotate(count=Count("id"))
        )

        category_breakdown = {
            item["category"]: item["count"]
            for item in category_data
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })

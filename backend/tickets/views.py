import os
import json
import requests

from rest_framework import generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Ticket
from .serializers import TicketSerializer


# -------------------------------
# Ticket List & Create
# -------------------------------
class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "priority", "status"]
    search_fields = ["title", "description"]


# -------------------------------
# Ticket Update
# -------------------------------
class TicketUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


# -------------------------------
# Ticket Stats
# -------------------------------
class TicketStatsView(APIView):

    def get(self, request):
        total_tickets = Ticket.objects.aggregate(total=Count("id"))["total"] or 0

        open_tickets = Ticket.objects.filter(status="open").aggregate(
            total=Count("id")
        )["total"] or 0

        daily_counts = (
            Ticket.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
        )

        avg_per_day = daily_counts.aggregate(avg=Avg("count"))["avg"] or 0

        priority_data = Ticket.objects.values("priority").annotate(count=Count("id"))
        priority_breakdown = {
            item["priority"]: item["count"] for item in priority_data
        }

        category_data = Ticket.objects.values("category").annotate(count=Count("id"))
        category_breakdown = {
            item["category"]: item["count"] for item in category_data
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })


# -------------------------------
# AI Ticket Classifier
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class TicketClassifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        description = request.data.get("description")

        if not description:
            return Response({"error": "Description is required"}, status=400)

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openrouter/free",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""
You are a support ticket classifier.

Classify the description into:

Categories:
- billing
- technical
- account
- general

Priority:
- low
- medium
- high
- critical

Respond ONLY in pure JSON format:

{{
  "category": "...",
  "priority": "..."
}}

Description:
{description}
"""
                        }
                    ],
                    "temperature": 0
                }
            )

            # If OpenRouter fails
            if response.status_code != 200:
                return Response({
                    "openrouter_error": response.json()
                }, status=response.status_code)

            data = response.json()

            if "choices" not in data:
                return Response({
                    "openrouter_error": data
                }, status=400)

            content = data["choices"][0]["message"]["content"]

            # Extract JSON safely
            try:
                json_start = content.find("{")
                json_end = content.rfind("}") + 1
                clean_json = content[json_start:json_end]
                parsed = json.loads(clean_json)
            except:
                return Response({
                    "error": "Model returned invalid JSON",
                    "raw_response": content
                }, status=500)

            return Response({
                "suggested_category": parsed.get("category", "general"),
                "suggested_priority": parsed.get("priority", "low")
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializer converts Ticket model instances
    into JSON and validates incoming JSON data.
    """

    class Meta:
        model = Ticket
        fields = "__all__"

        # These fields should not be editable by client
        read_only_fields = ["id", "created_at"]

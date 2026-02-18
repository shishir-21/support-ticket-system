from django.db import models


class Ticket(models.Model):
    """
    Ticket model represents a support ticket in the system.

    Each ticket contains:
    - title
    - description
    - category
    - priority
    - status
    - created_at timestamp
    """

    # ----------------------------
    # CATEGORY OPTIONS
    # ----------------------------
    # These define allowed categories for a ticket.
    CATEGORY_CHOICES = [
        ("billing", "Billing"),
        ("technical", "Technical"),
        ("account", "Account"),
        ("general", "General"),
    ]

    # ----------------------------
    # PRIORITY OPTIONS
    # ----------------------------
    # Defines urgency level of ticket.
    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    # ----------------------------
    # STATUS OPTIONS
    # ----------------------------
    # Defines lifecycle stage of ticket.
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    # ----------------------------
    # BASIC FIELDS
    # ----------------------------

    # Short title of the ticket (max 200 characters)
    title = models.CharField(max_length=200)

    # Detailed explanation of the issue
    description = models.TextField()

    # ----------------------------
    # CLASSIFICATION FIELDS
    # ----------------------------

    # Category must be one of CATEGORY_CHOICES
    # Default is "general"
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="general"
    )

    # Priority must be one of PRIORITY_CHOICES
    # Default is "low"
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="low"
    )

    # Status must be one of STATUS_CHOICES
    # Default is "open"
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open"
    )

    # ----------------------------
    # AUTO TIMESTAMP
    # ----------------------------

    # Automatically sets when ticket is created
    created_at = models.DateTimeField(auto_now_add=True)

    # ----------------------------
    # STRING REPRESENTATION
    # ----------------------------

    # This controls how the object appears in Django Admin
    def __str__(self):
        return self.title

# Support Ticket System – Tech Intern Assessment

##  Overview

This project is a full-stack Support Ticket System built as part of the Tech Intern – Full Stack Development assessment.

The system allows users to:
- Create support tickets
- Automatically classify tickets using an LLM
- Override suggested category and priority
- Filter and search tickets
- Update ticket status
- View aggregated ticket statistics

The entire application runs using Docker with a single command.

---

##  Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- OpenRouter (LLM integration)
- Django ORM (aggregate, annotate)

### Frontend
- React (Create React App)
- Fetch API
- Component-based architecture

### Infrastructure
- Docker
- Docker Compose
- PostgreSQL volume persistence
- Database healthcheck configuration

---

##  Setup Instructions


### 1️ Create Environment File

Create a `.env` file in the root directory:

OPENROUTER_API_KEY=your_api_key_here


*(The project uses OpenRouter for LLM integration.)*



### 2️ Run the Application

docker compose up --build



### 3️ Access the Application

Frontend:
http://localhost:3000

Backend API:
http://localhost:8000/api/



## LLM Integration

The endpoint:

POST /api/tickets/classify/

- Accepts a ticket description as input
- Sends a request to the OpenRouter Chat Completion API
- Uses structured JSON prompting to enforce consistent output format
- Returns suggested:
  - Category (billing, technical, account, general)
  - Priority (low, medium, high, critical)

Environment variable used:
OPENROUTER_API_KEY

Graceful fallback is implemented:
If the LLM request fails (e.g., missing API key, network issue, invalid response),
the system defaults to:

- category: general
- priority: low

This ensures ticket creation is never blocked due to LLM failure.



## Stats Endpoint

The endpoint:

GET /api/tickets/stats/

Uses database-level aggregation:

- Count()
- Avg()
- TruncDate()
- annotate()
- aggregate()

No Python-level loops are used for aggregation.



##  Key Design Decisions

- Docker-first architecture
- PostgreSQL volume persistence
- Healthcheck-based service dependency
- Environment variable-based secret handling
- Graceful LLM error handling
- Separation of concerns (service layer in frontend)
- Clean REST API structure



##  Features Implemented

- Ticket CRUD API
- Filtering (category, priority, status)
- Search (title + description)
- Live status updates (without page reload)
- Stats dashboard with auto-refresh
- LLM-based auto-classification
- Fully containerized deployment



##  Submission Notes

- Entire project runs with `docker compose up --build`
- No manual setup required (except API key)
- `.git` directory included for commit history review



## API Endpoints

Base URL:
http://localhost:8000/api/

Available endpoints:

- GET /tickets/ → List all tickets
- POST /tickets/ → Create a ticket
- PATCH /tickets/{id}/ → Update ticket status
- GET /tickets/?category=... → Filter by category
- GET /tickets/?priority=... → Filter by priority
- GET /tickets/?status=... → Filter by status
- GET /tickets/?search=... → Search by title or description
- GET /tickets/stats/ → Get aggregated statistics
- POST /tickets/classify/ → Classify ticket using LLM

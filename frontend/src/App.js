import { getTickets, updateTicket, getStats } from "./services/api";
import { useEffect, useState } from "react";
import TicketForm from "./components/TicketForm";


/**
 * Main Application Component
 * Loads tickets and renders form + ticket list
 */
function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // Load tickets from backend with filters + search
  const loadTickets = async () => {
    let query = "?";

    // Add filters if selected
    if (categoryFilter) query += `category=${categoryFilter}&`;
    if (priorityFilter) query += `priority=${priorityFilter}&`;
    if (statusFilter) query += `status=${statusFilter}&`;
    if (searchTerm) query += `search=${searchTerm}&`;

    const data = await getTickets(query);
    setTickets(data);
  };

  /**
  * Load dashboard stats from backend
  */
  const loadStats = async () => {
    try {
      const data = await getStats();
      console.log("Stats Data:", data);
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };


  // Reload tickets whenever filter changes
  useEffect(() => {
    loadTickets();
    loadStats();
  }, [categoryFilter, priorityFilter, statusFilter, searchTerm]);

  return (
    <div>
      {/* Ticket Creation Form */}
      <TicketForm
        onTicketCreated={() => {
          loadTickets();
          loadStats();
        }}
      />


      <h2>Stats Dashboard</h2>

      {stats && (
        <div style={{ marginBottom: "30px", padding: "10px", border: "1px solid #ccc" }}>
          <p><strong>Total Tickets:</strong> {stats.total_tickets}</p>
          <p><strong>Open Tickets:</strong> {stats.open_tickets}</p>
          <p><strong>Avg Tickets Per Day:</strong> {stats.avg_tickets_per_day}</p>

          <h4>Priority Breakdown:</h4>
          {Object.entries(stats.priority_breakdown).map(([key, value]) => (
            <p key={key}>{key}: {value}</p>
          ))}

          <h4>Category Breakdown:</h4>
          {Object.entries(stats.category_breakdown).map(([key, value]) => (
            <p key={key}>{key}: {value}</p>
          ))}
        </div>
      )}


      <h2>Filters</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", display: "block" }}
      />

      <select onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="">All Categories</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <select onChange={(e) => setPriorityFilter(e.target.value)}>
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <h2>Tickets</h2>

      {/* Ticket List */}
      {tickets.map((ticket) => (
        <div key={ticket.id} style={{ marginBottom: "20px" }}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>

          <p>
            {ticket.category} | {ticket.priority} | {ticket.status}
          </p>


          <label>Status: </label>
          <select
            value={ticket.status}
            onChange={async (e) => {
              await updateTicket(ticket.id, { status: e.target.value });
              loadTickets();
              await loadStats(); 
            }}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}

    </div>
  );
}

export default App;

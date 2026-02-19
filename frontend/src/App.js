import { useEffect, useState } from "react";
import TicketForm from "./components/TicketForm";
import { getTickets, updateTicket } from "./services/api";


/**
 * Main Application Component
 * Loads tickets and renders form + ticket list
 */
function App() {
  const [tickets, setTickets] = useState([]);
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  // Load tickets with filters
  const loadTickets = async () => {
    let query = "?";

    // Add filters if selected
    if (categoryFilter) query += `category=${categoryFilter}&`;
    if (priorityFilter) query += `priority=${priorityFilter}&`;
    if (statusFilter) query += `status=${statusFilter}&`;

    const data = await getTickets(query);
    setTickets(data);
  };



  // Reload tickets whenever filter changes
  useEffect(() => {
    loadTickets();
  }, [categoryFilter, priorityFilter, statusFilter]);

  return (
    <div>
      {/* Ticket Creation Form */}
      <TicketForm onTicketCreated={loadTickets} />

      <h2>Filters</h2>

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

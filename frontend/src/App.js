import { useEffect, useState } from "react";
import TicketForm from "./components/TicketForm";
import { getTickets, updateTicket } from "./services/api";


/**
 * Main Application Component
 * Loads tickets and renders form + ticket list
 */
function App() {
  const [tickets, setTickets] = useState([]);

  /**
   * Load tickets from backend
   */
  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    }
  };

  // Load tickets when component mounts
  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div>
      {/* Ticket Creation Form */}
      <TicketForm onTicketCreated={loadTickets} />

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

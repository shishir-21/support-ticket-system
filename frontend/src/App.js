import { useEffect, useState } from "react";
import TicketForm from "./components/TicketForm";
import { getTickets } from "./services/api";

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
        <div key={ticket.id}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>
            {ticket.category} | {ticket.priority} | {ticket.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;

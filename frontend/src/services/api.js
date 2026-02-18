// Base URL of backend API
// Change this if backend runs on different host/port
const API_BASE = "http://localhost:8000/api";

/**
 * Fetch all tickets
 * @param {string} params - optional query parameters
 */
export const getTickets = async (params = "") => {
  const response = await fetch(`${API_BASE}/tickets/${params}`);
  return response.json();
};

/**
 * Create new ticket
 * @param {object} data - ticket payload
 */
export const createTicket = async (data) => {
  const response = await fetch(`${API_BASE}/tickets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

/**
 * Update ticket (status, priority etc.)
 * @param {number} id - ticket id
 * @param {object} data - updated fields
 */
export const updateTicket = async (id, data) => {
  const response = await fetch(`${API_BASE}/tickets/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

/**
 * Get dashboard stats
 */
export const getStats = async () => {
  const response = await fetch(`${API_BASE}/tickets/stats/`);
  return response.json();
};

/**
 * Call LLM classification endpoint
 * @param {string} description - ticket description
 */
export const classifyTicket = async (description) => {
  const response = await fetch(`${API_BASE}/tickets/classify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  return response.json();
};

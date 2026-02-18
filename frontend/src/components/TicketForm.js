import { useState } from "react";
import { createTicket, classifyTicket } from "../services/api";

/**
 * TicketForm Component
 * Handles:
 * - Ticket creation
 * - Auto LLM classification
 */
const TicketForm = ({ onTicketCreated }) => {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);

  /**
   * Auto classify ticket using LLM
   * Triggered when description loses focus (onBlur)
   */
  const handleClassify = async () => {
    if (!description) return;

    setLoading(true);

    try {
      const result = await classifyTicket(description);

      // Update category & priority from backend suggestion
      setCategory(result.suggested_category || "general");
      setPriority(result.suggested_priority || "low");
    } catch (error) {
      console.error("Classification failed:", error);
    }

    setLoading(false);
  };

  /**
   * Submit ticket to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket({
        title,
        description,
        category,
        priority,
      });

      // Reset form after submission
      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("low");

      // Reload tickets in parent component
      onTicketCreated();
    } catch (error) {
      console.error("Ticket creation failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>

      {/* Title Input */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Description Input */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleClassify}
        required
      />

      {/* LLM Loading Indicator */}
      {loading && <p>Classifying...</p>}

      {/* Category Dropdown */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      {/* Priority Dropdown */}
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default TicketForm;

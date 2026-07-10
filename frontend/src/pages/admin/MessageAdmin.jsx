import { useEffect, useState } from "react";
import api from "../../api/axios";

function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  const getMessages = async () => {
    try {
      const response = await api.get("/admin/contact-messages");

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setMessages(list);
    } catch (error) {
      console.log(error);
      alert("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      await api.patch(`/admin/contact-messages/${id}/toggle-read`);

      setAlertMessage("Message status updated successfully.");
      getMessages();
    } catch (error) {
      console.log(error);
      alert("Failed to update message status.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/contact-messages/${id}`);

      setAlertMessage("Message deleted successfully.");
      getMessages();
    } catch (error) {
      console.log(error);
      alert("Failed to delete message.");
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Contact Messages</h3>
      <p className="text-muted">
        View messages sent by visitors from the contact form.
      </p>

      {alertMessage && (
        <div className="alert alert-success">
          {alertMessage}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Message List</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th width="220">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(messages) && messages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <strong>{message.name}</strong>
                    </td>

                    <td>{message.email}</td>

                    <td>{message.subject || "No Subject"}</td>

                    <td>
                      <span className="text-muted">
                        {message.message?.slice(0, 80)}...
                      </span>
                    </td>

                    <td>
                      {message.is_read ? (
                        <span className="badge bg-success">Read</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Unread
                        </span>
                      )}
                    </td>

                    <td>
                      {message.created_at
                        ? message.created_at.slice(0, 10)
                        : "N/A"}
                    </td>

                    <td>
                      <button
                        className="btn btn-info btn-sm me-2 text-white"
                        onClick={() => handleToggleRead(message.id)}
                      >
                        {message.is_read ? "Unread" : "Read"}
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(message.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {messages.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesAdmin;

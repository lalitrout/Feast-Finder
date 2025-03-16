import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://feast-finder.onrender.com"; // Backend URL

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    date: "",
    img: "", // Optional
    contactInfo: "", // Optional
  });

  const userId = localStorage.getItem("userId") || "";

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      toast.error("Error fetching events!");
      console.error(
        "❌ Error fetching events:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add Event
  const addEvent = async () => {
    if (!eventDetails.name || !eventDetails.location || !eventDetails.date) {
      toast.warn("Please fill in Name, Location, and Date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add an event.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/events`,
        { ...eventDetails, createdBy: userId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success("Event added & refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(
        "❌ Error adding event:",
        error.response?.data || error.message
      );
      toast.error("Failed to add event. Try again later.");
    }
  };

  // Delete Event
  const deleteEvent = async (id, ownerId) => {
    if (ownerId !== userId) {
      toast.warn("You can only delete your own events!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to delete an event.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEvents(events.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error(
        "❌ Error deleting event:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex mb-3">
        <button
          className="btn me-3"
          style={{ backgroundColor: "#FA5", color: "white" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "- Form" : "+ Event"}
        </button>
      </div>

      {showForm && (
        <div className="card p-3 my-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Event Name"
            value={eventDetails.name}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, name: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Event Location"
            value={eventDetails.location}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, location: e.target.value })
            }
          />
          <input
            type="date"
            className="form-control mb-2"
            value={eventDetails.date}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, date: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Paste image address here (Optional)"
            value={eventDetails.img}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, img: e.target.value })
            }
          />
          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
            {" "}
            <pre>
              {" "}
              For better image parsing, use a direct image address above.
              Example: Right-click an image on Unsplash, select 'Copy Image
              Address,' and paste here.
            </pre>
          </small>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Contact Info (Optional)"
            value={eventDetails.contactInfo}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, contactInfo: e.target.value })
            }
          />
          <button
            className="btn"
            style={{ backgroundColor: "#FA5", color: "white" }}
            onClick={addEvent}
          >
            Submit Event
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center">
          🍽️ Grabbing the feast details… Don't let your stomach growl just yet!
          😋
        </p>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event._id} className="col-md-4 col-sm-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={
                    event.img ||
                    "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  } // ✅ If no image, use placeholder
                  alt={event.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">
                    📍 {event.location} <br />
                    📅{" "}
                    {event.date
                      ? new Date(event.date).toDateString()
                      : "Date Not Available"}{" "}
                    <br />
                    📞 {event.contactInfo || "Not Provided"} <br />{" "}
                    {/* ✅ If no contact, show "Not Provided" */}
                    👤 Posted by:{" "}
                    {event.createdBy
                      ? event.createdBy.name || "Unknown"
                      : "Unknown"}
                  </p>

                  {event.createdBy?._id === userId && (
                    <button
                      className="btn"
                      style={{ backgroundColor: "#FA5", color: "white" }}
                      onClick={() =>
                        deleteEvent(event._id, event.createdBy?._id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;

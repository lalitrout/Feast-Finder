import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEllipsisV } from "react-icons/fa";

const API_BASE_URL = "https://feast-finder.onrender.com";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    date: "",
    img: "",
  });
  const [showDeleteOptions, setShowDeleteOptions] = useState(null);

  const userId = localStorage.getItem("userId") || "";

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      toast.error("Error fetching events!");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!eventDetails.name || !eventDetails.location || !eventDetails.date || !eventDetails.img) {
      toast.warn("Please fill all fields.");
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

      toast.success("Event added successfully!", {
        onClose: () => setTimeout(() => window.location.reload(), 300),
      });

      setEventDetails({ name: "", location: "", date: "", img: "" });
    } catch (error) {
      toast.error("Failed to add event.");
    }
  };

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

      toast.success("Event deleted successfully!", {
        onClose: () => setTimeout(() => window.location.reload(), 300),
      });
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Events List</h2>
        <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add Event"}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-4 shadow-sm border-0">
          <input type="text" className="form-control mb-3" placeholder="Event Name" 
            value={eventDetails.name} onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })} />
          <input type="text" className="form-control mb-3" placeholder="Event Location" 
            value={eventDetails.location} onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })} />
          <input type="date" className="form-control mb-3" 
            value={eventDetails.date} onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })} />
          <input type="text" className="form-control mb-3" placeholder="Paste image URL here" 
            value={eventDetails.img} onChange={(e) => setEventDetails({ ...eventDetails, img: e.target.value })} />
          <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} onClick={addEvent}>Submit Event</button>
        </div>
      )}

      <div className="row g-4">
        {events.map((event) => (
          <div key={event._id} className="col-lg-4 col-md-6">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden position-relative">
              <div className="position-absolute top-0 end-0 p-2">
                {event.createdBy?._id === userId && (
                  <div className="dropdown">
                    <FaEllipsisV role="button" onClick={() => setShowDeleteOptions(showDeleteOptions === event._id ? null : event._id)} />
                    {showDeleteOptions === event._id && (
                      <button className="btn btn-danger btn-sm mt-1" onClick={() => deleteEvent(event._id, event.createdBy?._id)}>Delete</button>
                    )}
                  </div>
                )}
              </div>
              <img src={event.img} alt={event.name} className="card-img-top" 
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                style={{ height: "220px", objectFit: "cover" }} />
              <div className="card-body text-center">
                <h5 className="card-title text-dark fw-bold">{event.name}</h5>
                <p className="card-text text-muted mb-3">
                  📍 {event.location} <br />
                  📅 {event.date ? new Date(event.date).toDateString() : "Date Not Available"} <br />
                  👤 Posted by: {event.createdBy ? event.createdBy.name || "Unknown" : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;

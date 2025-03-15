import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://feast-finder.onrender.com"; // Backend URL

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    date: "",
  });
  const [image, setImage] = useState(null); // Store the selected file

  const userId = localStorage.getItem("userId") || "";

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      toast.error("Error fetching events!");
      console.error("❌ Error fetching events:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
    const eventMessage = localStorage.getItem("eventAdded");
    if (eventMessage) {
      toast.success(eventMessage);
      localStorage.removeItem("eventAdded");
    }
  }, []);

  // Add Event
  const addEvent = async () => {
    if (!eventDetails.name || !eventDetails.location || !eventDetails.date || !image) {
      toast.warn("Please fill all fields and select an image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add an event.");
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", eventDetails.name);
      formData.append("location", eventDetails.location);
      formData.append("date", eventDetails.date);
      formData.append("image", image); // Append the selected file
      formData.append("createdBy", userId);

      const response = await axios.post(`${API_BASE_URL}/api/events`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Update state instead of reloading
      setEvents([...events, response.data]);
      toast.success("Event added successfully!");
      setShowForm(false);
      setEventDetails({ name: "", location: "", date: "" });
      setImage(null);
    } catch (error) {
      console.error("❌ Error adding event:", error.response?.data || error.message);
      toast.error("Failed to add event. Try again later.");
    }
  };

  // Delete Event
  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to delete an event.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Remove deleted event from UI
      setEvents(events.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting event:", error.response?.data || error.message);
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
            onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Event Location"
            value={eventDetails.location}
            onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={eventDetails.date}
            onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
          />
          <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

          <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} onClick={addEvent}>
            Submit Event
          </button>
        </div>
      )}

      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm">
              <img
                src={event.img}
                alt={event.name}
                className="card-img-top"
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">
                  📍 {event.location} <br />
                  📅 {event.date ? new Date(event.date).toDateString() : "Date Not Available"} <br />
                  👤 Posted by: {event.createdBy ? event.createdBy.name || "Unknown" : "Unknown"}
                </p>

                {event.createdBy?._id === userId && (
                  <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} onClick={() => deleteEvent(event._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;

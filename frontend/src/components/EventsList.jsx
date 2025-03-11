import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    date: "",
    img: "",
  });

  const userId = localStorage.getItem("userId") || "";

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Error fetching events!");
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add Event
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
        "http://localhost:3001/api/events",
        { ...eventDetails, owner: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventDetails({ name: "", location: "", date: "", img: "" });
      setShowForm(false);
      fetchEvents();
      toast.success("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error.message);
      toast.error("Failed to add event. Try again later.");
    }
  };

  // Delete Event
  const deleteEvent = async (id, createdBy) => {
    if (createdBy !== userId) {
      toast.warn("You can only delete your own events!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to delete an event.");
        return;
      }

      await axios.delete(`http://localhost:3001/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
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
          <input type="text" className="form-control mb-2" placeholder="Event Name" 
            value={eventDetails.name} onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })} />
          <input type="text" className="form-control mb-2" placeholder="Event Location" 
            value={eventDetails.location} onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })} />
          <input type="date" className="form-control mb-2" 
            value={eventDetails.date} onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })} />
          <input type="text" className="form-control mb-2" placeholder="Image URL" 
            value={eventDetails.img} onChange={(e) => setEventDetails({ ...eventDetails, img: e.target.value })} />
          <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} onClick={addEvent}>
            Submit Event
          </button>
        </div>
      )}

      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm">
              <img src={event.img} alt={event.name} className="card-img-top" 
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                style={{ height: "200px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">
                  📍 {event.location} <br />
                  📅 {event.date ? new Date(event.date).toDateString() : "Date Not Available"} <br />
                  👤 Posted by: {event.createdBy?.name || "Unknown"}
                </p>

                {event.createdBy?._id === userId && (
                  <button className="btn" style={{ backgroundColor: "#FA5", color: "white" }} 
                    onClick={() => deleteEvent(event._id, event.createdBy?._id)}>
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

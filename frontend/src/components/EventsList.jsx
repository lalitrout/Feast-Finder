import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

// const API_BASE_URL = "https://feast-finder.onrender.com";
const API_BASE_URL = "http://localhost:3001";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    location: "",
    date: "",
    img: null,
    contactInfo: "",
  });

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setEventDetails((prev) => ({ ...prev, img: files[0] }));
    } else {
      setEventDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!eventDetails.img) {
      toast.warn("Please select an image before submitting.");
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    Object.entries(eventDetails).forEach(([key, val]) =>
      formData.append(key, val)
    );
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to post an event.");
        return;
      }
  
      await axios.post(`${API_BASE_URL}/api/events`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      toast.success("🎉 Event posted!");
      setEventDetails({
        name: "",
        location: "",
        date: "",
        img: null,
        contactInfo: "",
      });
  
      setTimeout(() => {
        setShowForm(false);
        fetchEvents();
      }, 3000);
  
    } catch (error) {
      console.error("❌ Error submitting event:", error.response?.data || error.message);
      toast.error("Failed to post event.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="text-start mb-4">
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#fa5", color: "white" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              className="form-control"
              value={eventDetails.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="form-control"
              value={eventDetails.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              name="date"
              className="form-control"
              value={eventDetails.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              name="img"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="contactInfo"
              placeholder="Contact Info (Optional)"
              className="form-control"
              value={eventDetails.contactInfo}
              onChange={handleChange}
            />
          </div>
          <button className="btn" type="submit" disabled={isSubmitting} style={{ backgroundColor: "#fa5", color: "white" }}>
            {isSubmitting ? "Posting..." : "Submit Event"}
          </button>
        </form>
      )}

      <div className="row">
        {loading ? (
          <p className="text-center">
            🍽️ Grabbing the feast details😋… this could take a minute!
          </p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="col-md-4 col-sm-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={event.img || "https://via.placeholder.com/200"}
                  alt={event.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body position-relative">
                  <div className="dropdown position-absolute top-0 end-0 p-2">
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      &#x22EE;
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          to={`/edit/${event._id}`}
                          className="dropdown-item"
                        >
                          ✏️ Edit
                        </Link>
                      </li>
                      {event.createdBy?._id === userId && (
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() =>
                              deleteEvent(event._id, event.createdBy?._id)
                            }
                          >
                            🗑️ Delete
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>

                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">
                    📍 {event.location} <br />
                    📅{" "}
                    {event.date
                      ? new Date(event.date).toDateString()
                      : "Date Not Available"}{" "}
                    <br />
                    📞 {event.contactInfo || "Not Provided"} <br />
                    👤 Posted by: {event.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList;

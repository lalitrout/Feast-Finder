import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://feast-finder.onrender.com";
// const API_BASE_URL = "http://localhost:3001";


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

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />
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
                  {/* Three Dots Menu */}
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

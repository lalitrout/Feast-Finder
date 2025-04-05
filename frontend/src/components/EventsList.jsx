import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://feast-finder.onrender.com";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    return () => {
      if (eventDetails.img) {
        URL.revokeObjectURL(eventDetails.img);
      }
    };
  }, [eventDetails.img]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        withCredentials: true,
      });
      const sortedEvents = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setEvents(sortedEvents);
    } catch (error) {
      toast.error("Error fetching events!");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id, ownerId) => {
    if (ownerId !== userId) {
      toast.warn("You can only delete your own events!");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to delete an event.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEvents(events.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
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

    if (!token) {
      toast.error("You must be logged in to post an event.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(eventDetails).forEach(([key, val]) =>
      formData.append(key, val)
    );

    try {
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
      }, 2000);
    } catch (error) {
      toast.error("Failed to post event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const orange = "#fa5";

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: orange }}>
          🍛 Upcoming Feast Events
        </h3>
        <button
          className="btn"
          style={{
            backgroundColor: orange,
            color: "#fff",
            borderRadius: "20px",
            padding: "8px 20px",
          }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Add Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="p-4 mb-5 rounded shadow-sm"
          style={{ backgroundColor: "#fff3e6" }}
        >
          <div className="row g-3">
            <div className="col-md-6">
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
            <div className="col-md-6">
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
            <div className="col-md-6">
              <input
                type="date"
                name="date"
                className="form-control"
                value={eventDetails.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="file"
                name="img"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                name="contactInfo"
                placeholder="Contact Info (Optional)"
                className="form-control"
                value={eventDetails.contactInfo}
                onChange={handleChange}
              />
            </div>

            {eventDetails.img && (
              <div className="col-12 text-center">
                <img
                  src={URL.createObjectURL(eventDetails.img)}
                  alt="Preview"
                  style={{
                    maxHeight: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              </div>
            )}

            <div className="col-12 text-end">
              <button
                className="btn"
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: orange,
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "8px 24px",
                }}
              >
                {isSubmitting ? "Posting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="row">
        {loading ? (
          <div className="col-12 text-center my-5">
            <div
              className="spinner-border text-orange"
              role="status"
              style={{ width: "2rem", height: "2rem" }}
            >
              <span className="visually-hidden">Fetching events... hang tight!</span>
            </div>
            <p className="mt-3 text-warning fw-semibold fs-6">
              Fetching events... hang tight!
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">No events yet. Be the first to post!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow border-0 h-100">
                <img
                  src={event.img || "https://via.placeholder.com/400"}
                  className="card-img-top"
                  alt={event.name}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body position-relative">
                  <h5 className="card-title" style={{ color: orange }}>
                    {event.name}
                  </h5>
                  <p className="card-text text-secondary">
                    📍 {event.location} <br />
                    📅 {new Date(event.date).toDateString()} <br />
                    📞 {event.contactInfo || "Not Provided"} <br />
                    👤 {event.createdBy?.name || "Anonymous"}
                  </p>

                  {event.createdBy?._id === userId && (
                    <div className="dropdown position-absolute top-0 end-0 m-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <Link
                            to={`/edit/${event._id}`}
                            className="dropdown-item"
                          >
                            ✏️ Edit
                          </Link>
                        </li>
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
                      </ul>
                    </div>
                  )}
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

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    date: "",
    contactInfo: "",
    img: null,
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://feast-finder.onrender.com/api/events/${id}`
        );
        const event = response.data;
        setEventData({
          name: event.name,
          location: event.location,
          date: event.date.split("T")[0],
          contactInfo: event.contactInfo,
          img: event.img,
        });
        setPreviewImg(event.img);
      } catch (error) {
        console.error(
          "❌ Error fetching event:",
          error.response?.data || error.message
        );
        toast.error("Failed to load event");
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({ ...prev, img: file }));
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      setLoading(false); // Stop loading
      return;
    }

    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("location", eventData.location);
    formData.append("date", eventData.date);
    formData.append("contactInfo", eventData.contactInfo);
    if (eventData.img instanceof File) {
      formData.append("img", eventData.img);
    }

    try {
      await axios.put(
        `https://feast-finder.onrender.com/api/events/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Refresh-Token": localStorage.getItem("refreshToken"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Event updated successfully!");
      setTimeout(() => navigate("/eventslist"), 2000);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      toast.error(
        "Failed to update event: " +
          (err.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div
          className="card-header text-white"
          style={{ backgroundColor: "#ff7f50" }}
        >
          <h4 className="mb-0">Edit Event</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Event Name</label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                value={eventData.contactInfo}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {previewImg && (
                <div className="mt-2 text-center">
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn w-100 text-white"
              style={{ backgroundColor: "#ff7f50" }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;

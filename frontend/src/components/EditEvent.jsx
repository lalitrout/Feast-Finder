import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    date: "",
    contactInfo: "",
    img: null,
  });

  const orange = "#fa5";

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
        console.error("❌ Error fetching event:", error.response?.data || error.message);
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
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, val]) => {
      if (key === "img" && val instanceof File) {
        formData.append(key, val);
      } else if (key !== "img") {
        formData.append(key, val);
      }
    });

    try {
      await axios.put(
        `https://feast-finder.onrender.com/api/events/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("🎉 Event updated!");
      setTimeout(() => navigate("/eventslist"), 2000);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      toast.error(
        "Failed to update event: " +
          (err.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg text-white mx-auto"
        style={{ maxWidth: "600px", backgroundColor: "#fff3e6" }}
      >
        <div className="card-header text-white text-center fw-bold" style={ { backgroundColor: orange } }>
          ✏️ Edit Event Details
        </div>
        <div className="card-body p-4" >
          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label fw-semibold text-orange" >Event Name</label>
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
              <label className="form-label fw-semibold text-orange">Location</label>
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
              <label className="form-label fw-semibold text-orange">Date</label>
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
              <label className="form-label fw-semibold text-orange">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                value={eventData.contactInfo}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-orange">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {previewImg && (
                <div className="mt-3 text-center">
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="img-thumbnail shadow-sm"
                    style={{ maxWidth: "220px", maxHeight: "220px" }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{
                backgroundColor: "#ff914d",
                borderRadius: "8px",
                padding: "10px",
              }}
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

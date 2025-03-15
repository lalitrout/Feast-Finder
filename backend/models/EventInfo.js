const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventInfoSchema = new Schema({
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.Mixed, required: true },
    date: { type: Date, required: true },
    img: {
        url: { type: String, required: true }, // Cloudinary Image URL
        public_id: { type: String, required: true }, // Cloudinary Image ID for deletion
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link event to user
}, { timestamps: true });

const EventInfo = mongoose.model("EventInfo", EventInfoSchema);
module.exports = EventInfo;

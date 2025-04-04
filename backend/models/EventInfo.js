const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventInfoSchema = new Schema({
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.Mixed, required: true },
    date: { type: Date, required: true },
    img: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link event to user
    contactInfo: { type: String }
});

const EventInfo = mongoose.model("EventInfo", EventInfoSchema);
module.exports = EventInfo;

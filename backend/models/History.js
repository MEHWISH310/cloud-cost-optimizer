const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    uid: { type: String, required: true },
    type: { type: String, enum: ["calculation", "recommendation"], required: true },
    input: { type: Object, required: true },
    output: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
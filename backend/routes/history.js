const express = require("express");
const router = express.Router();
const History = require("../models/History");
const User = require("../models/User");

router.post("/user", async (req, res) => {
    try {
        const { uid, name, email, photo } = req.body;
        let user = await User.findOne({ uid });
        if (!user) {
            user = await User.create({ uid, name, email, photo });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/save", async (req, res) => {
    try {
        const { uid, type, input, output } = req.body;
        const entry = await History.create({ uid, type, input, output });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:uid", async (req, res) => {
    try {
        const history = await History.find({ uid: req.params.uid }).sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await History.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
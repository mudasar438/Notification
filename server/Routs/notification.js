// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/:userId", async (req, res) => {
  const userId = req.body.userId;
  const notifications = await Notification.find({ userId: userId });
  res.json(notifications);
});
router.post("/addNotification", async (req, res) => {
  const notifications = new Notification({
    userId: req.body.userId,
    message: `this is a Notification`,
  });

  const saved = await notifications.save();

  res.json(saved);
});
router.put("/:id", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });
  res.json(notification);
});

module.exports = router;

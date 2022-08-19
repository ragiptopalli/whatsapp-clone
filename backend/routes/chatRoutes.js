const express = require("express");
const { protect } = require("../middleware/authMiddlware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename_group").put(protect, renameGroupChat);
router.route("/add_to_group").put(protect, addToGroupChat);
router.route("/remove_from_group").put(protect, removeFromGroupChat);

module.exports = router;

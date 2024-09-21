const mongoose = require("mongoose");
const contact = mongoose.model("Contact", {
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: String,
});

module.exports = contact;

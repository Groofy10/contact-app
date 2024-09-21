const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECT_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });
// const contact1 = new contact({
//     name: "Ferdy",
//     number: "085711916591",
//     email: "ferdy@gmail.com",
//   });
// contact1.save().then((contact) => console.log(contact));

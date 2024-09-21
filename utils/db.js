const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ferdyjonathan12:testdatabase@cluster0.ebibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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

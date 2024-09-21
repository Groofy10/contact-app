const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const ckParser = require("cookie-parser");
const flash = require("connect-flash");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const path = require("path");

require("./utils/db");
const contact = require("./model/contact");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(ckParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.render("home", {
    layout: "layouts/main",
    name: "Ferdy Jonathan",
    title: "Home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main",
    title: "About",
  });
});

app.get("/contact", async (req, res) => {
  const startTime = Date.now(); // Mulai timer

  try {
    console.log("Fetching contacts from the database...");
    const contacts = await contact.find(); // Ambil dari database
    const duration = Date.now() - startTime; // Hitung waktu

    console.log(`Fetched ${contacts.length} contacts in ${duration}ms`);

    res.render("contact", {
      layout: "layouts/main",
      title: "Contact",
      contacts,
      msg: req.flash("msg"),
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contact/add", (req, res) => {
  res.render("new-contact", {
    layout: "layouts/main",
    title: "Add Contact",
  });
});

app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const isSame = await contact.findOne({ name: value });
      if (isSame) {
        throw new Error("Name Already Exist!");
      }
      return true;
    }),
    check("email", "Invalid Email Address!").isEmail(),
    check("number", "Invalid Phone Number!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("new-contact", {
        layout: "layouts/main",
        title: "Add Contact",
        errors: errors.array(),
      });
    } else {
      await contact.insertMany(req.body);
      req.flash("msg", "The contact has been added to your list");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:name", async (req, res) => {
  const contactView = await contact.findOne({ name: req.params.name });
  res.render("detail", {
    layout: "layouts/main",
    title: "Detail",
    contactView,
  });
});

app.delete("/contact", async (req, res) => {
  await contact.deleteOne({ _id: req.body._id });

  req.flash("msg", "The contact has been deleted");
  res.redirect("/contact");
});

app.get("/contact/update/:name", async (req, res) => {
  const contactExist = await contact.findOne({ name: req.params.name });
  res.render("edit-contact", {
    layout: "layouts/main",
    title: "Edit Contact",
    contactExist,
  });
});

app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const isSame = await contact.findOne({ name: value });
      if (value != req.body.oldName && isSame) {
        throw new Error("Name Already Exist!");
      }
      return true;
    }),
    check("email", "Invalid Email Address!").isEmail(),
    check("number", "Invalid Phone Number!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        layout: "layouts/main",
        title: "Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
          },
        }
      );
      req.flash("msg", "Contact Sucessfully Changed");
      res.redirect("/contact");
    }
  }
);

app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

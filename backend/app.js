const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const cors = require("cors");


const votesRoutes =  require ("./routes/votes")
const userRoutes =  require ("./routes/user")


const app = express();
const config = require("./config/config");

const PORT = process.env.PORT || 3000;
const db = config.MONGODBURI;
app.get("/", function (req, res) {
  res.send("helooo from server");
});

app.listen(PORT, function () {
  console.log(" server running on local host" + PORT);
});

mongoose.connect(
  db,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("Error" + err);
    } else {
      console.log(" connected to mongo db");
    }
  }
);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false }));
// app.use("/images", express.static(path.join("images")));
app.use("/images", express.static(path.join("images")));
app.use("/api/vote",votesRoutes)
app.use("/api/user",userRoutes)

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Header",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, PUT, OPTIONS"
//   );
//   next();
// });

module.exports= app;

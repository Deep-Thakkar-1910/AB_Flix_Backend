const express = require("express");
const movieRouter = require("./routes/MovieRoutes");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initate app
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/movies", movieRouter);

// listen for all the requests
app.listen(process.env.PORT || PORT, () => {
  console.log("App is running on " + PORT);
});

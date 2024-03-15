const express = require("express");
const movieRouter = require("./routes/MovieRoutes");
const TvShowsRouter = require("./routes/TvShowsRoutes");
const UserRouter = require("./routes/UserRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initate app
app.get("/", (req, res) => {
  res.send("hello world");
});

// movie related routes
app.use("/movies", movieRouter);

// Tvhsows related routes
app.use("/tvshows", TvShowsRouter);

// using cookieParser for user routes
app.use(cookieParser());

// user related routes
app.use("/user", UserRouter);

// listen for all the requests
app.listen(process.env.PORT || PORT, () => {
  console.log("App is running on " + PORT);
});

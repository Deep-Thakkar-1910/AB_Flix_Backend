const express = require("express");
const movieRouter = require("./routes/MovieRoutes");
const TvShowsRouter = require("./routes/TvShowsRoutes");
const UserRouter = require("./routes/UserRoutes");
const cookieParser = require("cookie-parser");
const trendingRoutes = require("./routes/trendingRoutes");
const allowCredentials = require("./middlewares/allowCredentials");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allowing the allowed origins to use credentials
app.use(allowCredentials);

// enabling cors policy
app.use(cors(corsOptions));

// movie related routes
app.use("/movies", movieRouter);

// Tvhsows related routes
app.use("/tvshows", TvShowsRouter);

// trending route to get trending movies and tv Shows from tmdb api
app.use("/trending", trendingRoutes);

// using cookieParser for user routes
app.use(cookieParser());

// user related routes
app.use("/user", UserRouter);

// global catch for not Found
app.all("*", (req, res) => {
  //  if any request apart from the above provided route comes send a 404 error
  res.sendStatus(404);
});

// listen for all the requests
app.listen(process.env.PORT || PORT, () => {
  console.log("App is running on " + PORT);
});

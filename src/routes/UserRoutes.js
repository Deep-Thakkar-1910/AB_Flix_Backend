const express = require("express");
const UserRouter = express.Router();
const handleRefreshToken = require("../controllers/RefreshTokenController");
const authenticateJwt = require("../middlewares/authenticateJwtMiddleware");
const {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/WatchlistController");
const {
  handleLogin,
  handleRegister,
  handleJwtLogin,
} = require("../controllers/UserController");

// to create (Register) a new user
UserRouter.post("/register", handleRegister);

// to login as an existing user
UserRouter.post("/login", handleLogin);

// to get details of a user using jwt for persistent login
UserRouter.get("/details", authenticateJwt, handleJwtLogin);

// to get new accessToken using the refresh token
UserRouter.get("/refresh", handleRefreshToken);

// to get a users watchlist
UserRouter.get("/watchlist", authenticateJwt, getUserWatchlist);

// to add new movies or tvshows to a user's watchlist based on id
UserRouter.post("/watchlist/:id", authenticateJwt, addToWatchlist);

// to remove movies or tvshows to a user's watchlist based on id
UserRouter.delete("/watchlist/:id", authenticateJwt, removeFromWatchlist);
module.exports = UserRouter;

const jwt = require("jsonwebtoken");

// importing dotenv config for accessing environment variables
require("dotenv/config");

const handleRefreshToken = async (req, res) => {
  // extracting the cookie from request object
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  //  extracting refreshToken from cookie
  const refreshToken = cookies.jwt;

  //   verifying the jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({ success: false, message: "Unathorized" });
    // making a new access token from user object verified from refresh token
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" } // NOTE: This evaluates to 15 mins
    );
    res.json({ accessToken });
  });
};

module.exports = handleRefreshToken;

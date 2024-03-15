const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// importing dotenv config for accessing environment variables
require("dotenv/config");

//  fetching the user model from models
const User = require("../models/Users");

// handler function to create a new user in the database
const handleRegister = async (req, res) => {
  try {
    //   extracting the username(email) and password from body object
    const { name, email, password, profileImage } = req.body;

    // define a regex for email to perform an exactly matching case-Insenstive search
    const emailRegex = new RegExp(`^${email}$`, "i");

    // checking if user already exists in database
    const doesUserExist = await User.findOne({ email: { $regex: emailRegex } });

    // if user exists fail registration with an error
    if (doesUserExist)
      return res
        .status(409)
        .json({ success: false, message: "Email Already Registred" });

    //   hashing the password with a salt to save in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // saving the user in database
    const user = new User({
      name,
      email,
      profileImage: profileImage ? profileImage : null,
      password: hashedPassword,
      watchList: [],
    });
    await User.create(user);

    res.status(201).json({
      success: true,
      message: "User registered successfuly",
      name,
      email: email,
    });
  } catch (err) {
    // logging the error
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Can't register user please try again",
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    //   extracting the username(email) and password from body object
    const { email, password } = req.body;
    // define a regex for email to perform an exactly matching case-Insenstive search
    const emailRegex = new RegExp(`^${email}$`, "i");
    //   finding that if the entered email is correct
    const doesUserExist = await User.findOne({ email: { $regex: emailRegex } });
    // if given email is incorrect send a 401 unAuthorized error with invalid email error
    if (!doesUserExist) {
      return res
        .status(401)
        .json({ success: false, message: "Given email id does not exist" });
    }

    // proceeding ahead to check password if given email is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      doesUserExist.password
    );

    // if given password is not correct return a 401 unAuthorized error with invalid password login
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password please try again",
      });
    }

    // creating a access_jwt token for auth during further logins
    const accessToken = jwt.sign(
      { email: doesUserExist.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "900s", // NOTE: This evaulates to 15 mins
      }
    );

    // creating a refresh_jwt token for refreshing the access tokens as they expire
    const refreshToken = jwt.sign(
      { email: doesUserExist.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    //storing the refresh token onClient side as a http only cookie for 7 days
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 168 * 60 * 60 * 1000, // NOTE: this evaluates to 7 days in milliseconds
      //   after this period the user will have to re-Login for safety purposes
    });

    // sending the success and accessToken as a response back to the client
    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    // logging the error
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Can't login please try again",
    });
  }
};

// handler function to get user detials using jwt access_token
const handleJwtLogin = async (req, res) => {
  // extracting user email using user object from middleware
  const user = req.user;

  // define a regex for email to perform an exactly matching case-Insenstive search
  const emailRegex = new RegExp(`^${user.email}$`, "i");

  // getting the user details from database
  const userDetails = await User.findOne(
    { email: { $regex: emailRegex } },
    { _id: 0, email: 1, profileImage: 1, name: 1 }
  );

  // if no user is found return a 404 error
  if (!userDetails)
    return res
      .status(404)
      .json({ success: false, message: "User not found please login again" });

  //else send the response back to client
  res.status(200).json({ success: true, userDetails });
};
module.exports = {
  handleRegister,
  handleLogin,
  handleJwtLogin,
};

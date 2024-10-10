const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { createUser, getUserByEmail, getUser } = require("../db");

router.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!email) {
    console.log("No email");
    next({ name: "EmailRequiredError", message: "Email not provided!" });
  }
  if (!password) {
    console.log("No pwd");

    next({
      name: "PasswordRequiredError",
      message: "Password not provided!",
    });
  }
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("user already");

      next({
        name: "ExistingUserError",
        message: "user already registered with that email",
      });
    }
    const newUser = await createUser(req.body);
    if (newUser) {
      const token = jwt.sign(
        { id: newUser.id, email },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );

      res.send({
        message: "Registration successful!",
        token,
        user: {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
        },
      });
    } else {
      next({
        name: "RegistrationError",
        message: "Error registering, try later",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await getUser(req.body);
    console.log(result);
    if (result) {
      const token = jwt.sign(
        { id: result.id, email: result.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({ message: "Successful login", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

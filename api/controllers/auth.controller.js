import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

//Register
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user and save the user to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
    console.log(newUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};

//Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //check if the user exists or not
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    //check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials" });

    // generate a cookie token and send to the user
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not set in the environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        // secure: true,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

//Logout
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

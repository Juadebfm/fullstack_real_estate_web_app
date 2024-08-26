import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get intended user" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.userId; // Use the ID from the token
  const { password, avatar, ...inputs } = req.body;

  try {
    let updateData = { ...inputs };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // If password was updated, include it in the response
    // If avatar was explicitly set (even to null), include it in the response
    // Otherwise, remove these fields from the response
    const responseUser = {
      ...updatedUser,
      ...(password ? {} : { password: undefined }),
      ...(avatar === undefined ? { avatar: undefined } : {}),
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Failed to update intended user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete intended user" });
  }
};

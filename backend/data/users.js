import bcrypt from "bcryptjs";
import { users } from "../config/mongo.js";
import { checkPassword, checkEmail, stringifyId, requireId } from "../validation.js";

/**
 * @typedef User
 * @property {import("mongodb").ObjectId} _id The ObjectID for this user
 * @property {string?} hash The hash of the user's salted password
 * @property {string} email The email the user registered with
 * @property {string[]} people The people this user manages
 */

/**
 * Create a new user.
 * @param {string} email An email to register the user with
 * @param {string} password A strong password
 * @returns {Promise<User>}
 */
export const createUser = async (email, password) => {
  email = checkEmail(email);
  checkPassword(password);

  const usersCol = await users();
  const existingUser = await usersCol.findOne({ email });
  if (existingUser)
    throw new Error("Email is already used by another account.");
  const res = await usersCol.insertOne({
    email,
    hash: await bcrypt.hash(password, 12),
    people: []
  });
  if (!res.acknowledged)
    throw new Error("Could not add user to database.")

  return {
    _id: res.insertedId.toString(),
    email,
    people: []
  };
};

/**
 * Verify a user's credentials. Returns null or the user on success.
 * @param {string} email The email to login with
 * @param {string} password The password to login with
 * @returns {Promise<User?>}
 */
export const verifyUser = async (email, password) => {
  const usersCol = await users();
  /** @type {User?} */
  const user = await usersCol.findOne({ email });
  if (!user) return null;
  return (await bcrypt.compare(password, user.hash)) ? stringifyId(user) : null;
};

/**
 * Gets a user by a specific ID.
 * @param {string|import("mongodb").ObjectId} userId The user ID to lookup a user by.
 * @returns {Promise<User?>} The requested user, or null if they don't exist.
 */
export const getUserById = async (userId) => {
  userId = requireId(userId);

  const usersCol = await users();
  return await usersCol.findOne({ _id: userId });
};

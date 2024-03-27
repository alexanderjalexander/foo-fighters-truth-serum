import * as tf from '@tensorflow/tfjs';
import { ObjectId } from "mongodb";
import { detections, users } from "../config/mongo.js";
import { StatusError, requireData, requireId, requireString } from "../validation.js";
import { getPersonById } from "./people.js";

let model;
setTimeout(async () => (model = await tf.loadLayersModel("http://localhost:4000/api/model/model.json")), 3000);

/**
 * @typedef Detection
 * @property {ObjectId} _id The ObjectID for this Detection
 * @property {string} name The name of this Detection
 * @property {any} data The data stored in this Detection 
 */

/**
 * Get a Detection by its id.
 * @param {ObjectId} id The id of the Detection to get
 * @returns {Promise<Detection?>} The Detection if it exists
 */
export const getDetection = async (id) => {
  id = requireId(id);

  const detectionsCol = await detections();
  return await detectionsCol.findOne({ _id: id });
};

/**
 * Create a new Detection.
 * @param {ObjectId} userId The User that manage the Person
 * @param {ObjectId} personId The Person to add the Detection to
 * @param {string} name The name for the Detection
 * @param {boolean} truth If the data represents a truth
 * @param {any} data The data to upload
 * @returns {Promise<Detection>} The created Detection
 */
export const createDetection = async (userId, personId, name, data, truth) => {
  userId = requireId(userId, "User ID");
  personId = requireId(personId, "Person ID");
  name = requireString(name, "Detection name");
  data = requireData(data);
  const person = await getPersonById(userId, personId);
  if (!person) throw new StatusError(404, "Person does not exist.");

  const detection = {
    _id: new ObjectId(),
    name,
    truth,
    data
  };

  const detectionsCol = await detections();
  const detectionRes = await detectionsCol.insertOne(detection);
  if (!detectionRes.acknowledged)
    throw new Error("Failed to add detection to database.")

  const usersCol = await users();
  const userAddRes = await usersCol.updateOne(
    {
      _id: userId,
      people: {
        $elemMatch: {
          _id: personId
        }
      }
    },
    {
      $push: {
        "people.$.detections": detection._id
      }
    }
  );
  if (!userAddRes.acknowledged)
    throw new Error("Failed to add detection to person.");

  return detection;
};

/**
 * Rename a Detection.
 * @param {ObjectId} id The id of the Detection to rename
 * @param {string} newName The new name for the Detection
 * @returns {Promise<Detection>} The updated Detection
 */
export const renameDetection = async (id, newName) => {
  id = requireId(id, "Detection ID");
  newName = requireString(newName, "Detection name");
  if (!(await getDetection(id)))
    throw new StatusError(404, "Detection does not exist.");

  const detectionsCol = await detections();
  const detectionRes = await detectionsCol.updateOne(
    { _id: id },
    { $set: { name: newName } }
  );
  if (!detectionRes.acknowledged)
    throw new Error("Failed to rename detection.")

  return await getDetection(id);
};

/**
 * Delete a Detection.
 * @param {ObjectId} id The id of the Detection to rename
 * @param {string} newName The new name for the Detection
 * @returns {Promise<void>}
 */
export const deleteDetection = async (id) => {
  id = requireId(id, "Detection ID");
  if (!(await getDetection(id)))
    throw new StatusError(404, "Detection does not exist.");

  const detectionsCol = await detections();
  const res = await detectionsCol.deleteOne({ _id: id });
  if (!res.acknowledged)
    throw new Error("Failed to delete detection.");
};

/**
 * Runs the prediction model on a given file.
 * @param {any} file A file object straight from the web request
 */
export const runDetection = async (file) => {
  const data = file.buffer.toString().split(',').map(v=>+v);
  const prediction = model.predict(tf.tensor3d([[data]]));
  const result = await prediction.data();
  return result[0][1] > result[0][0];
}
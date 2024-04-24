import * as tf from '@tensorflow/tfjs-node';
import { ObjectId } from "mongodb";
import { detections, users } from "../config/mongo.js";
import { StatusError, requireData, requireId, requireString } from "../validation.js";
import { getPersonById } from "./people.js";
import { getSessionById } from './sessions.js';

const modelPath = "file://./model/model.json";
const model = await tf.loadLayersModel(modelPath);
const maxFlagged = process.env.MAX_FLAGGED || 20;

/**
 * @typedef Detection
 * @property {ObjectId} _id The ObjectID for this Detection
 * @property {ObjectId} [sessionId] The ObjectID for the associated Session with this Detection
 * @property {ObjectId} owner The ID of the User owner of this Detection
 * @property {string} name The name of this Detection
 * @property {string} comment The comment on this Detection
 * @property {boolean} truth If this Detection is truthful
 * @param {number} confidence The confidence in the prediction
 * @property {boolean} flagged If this Detection is wrong
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
 * @param {ObjectId} [sessionId] The session ID to add the Detection to
 * @param {string} name The name for the Detection
 * @param {any} data The data to upload
 * @param {boolean} truth If the data represents a truth
 * @param {number} confidence The confidence in the prediction
 * @returns {Promise<Detection>} The created Detection
 */
export const createDetection = async (userId, personId, sessionId, name, data, truth, confidence) => {
  userId = requireId(userId, "User ID");
  personId = requireId(personId, "Person ID");
  if (sessionId) {
    sessionId = requireId(sessionId, "Session ID");
    if (!(await getSessionById(userId, personId, sessionId)))
      throw new StatusError(404, "Session does not exist.");
  }
  name = requireString(name, "Detection name");
  const person = await getPersonById(userId, personId);
  if (!person) throw new StatusError(404, "Person does not exist.");

  const detection = {
    _id: new ObjectId(),
    sessionId,
    owner: userId,
    name,
    truth,
    comment: '',
    confidence,
    flagged: false,
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
 * Flag a Detection.
 * @param {ObjectId} id The id of the Detection to rename
 * @returns {Promise<Detection>} The updated Detection
 */
export const flagDetection = async (id) => {
  id = requireId(id, "Detection ID");
  if (!(await getDetection(id)))
    throw new StatusError(404, "Detection does not exist.");

  const detectionsCol = await detections();
  const detectionRes = await detectionsCol.updateOne(
    { _id: id },
    { $set: { flagged: true } }
  );
  if (!detectionRes.acknowledged)
    throw new Error("Failed to flag detection.")

  try {
    const existingFlags = await detectionsCol.countDocuments({ flagged: true })
    if (existingFlags > maxFlagged) refit().catch(e => {
      console.error("Failed to run refitting task. See below error:");
      console.error(e);
    });
  } catch (e) {
    console.error("Failed to run refitting task. See below error:");
    console.error(e);
  }

  return await getDetection(id);
};

/**
 * Update the comment on a Detection.
 * @param {ObjectId} id The id of the Detection to comment on
 * @param {string} comment The text to update the comment to
 * @returns {Promise<Detection>} The updated Detection
 */
export const updateDetectionComment = async (id, comment) => {
  id = requireId(id, "Detection ID");
  if (typeof comment !== 'string')
    throw new StatusError(400, 'Comment must be a string.');
  comment = comment.trim();
  if (!(await getDetection(id)))
    throw new StatusError(404, "Detection does not exist.");

  const detectionsCol = await detections();
  const detectionRes = await detectionsCol.updateOne(
    { _id: id },
    { $set: { comment: comment } }
  );
  if (!detectionRes.acknowledged)
    throw new Error("Failed to update detection's comment.")

  return await getDetection(id);
};

/**
 * Moves a Detection to a specific Session, or removes it a Session.
 * @param {ObjectId} userId The User ID
 * @param {ObjectId} detectionId The Detection ID
 * @param {ObjectId} [sessionId] The Session ID
 */
export const moveToSession = async (userId, detectionId, sessionId) => {
  userId = requireId(userId, "User ID");
  detectionId = requireId(detectionId, "Detection ID");
  const detection = await getDetection(detectionId);
  if (!detection) throw new StatusError(404, "Detection does not exist.");
  const usersCol = await users();
  const user = await usersCol.findOne(
    {
      _id: userId,
      people: {
        $elemMatch: {
          detections: detectionId
        }
      }
    },
    {
      projection: {
        "people.$": 1
      }
    }
  );
  const detectionsCol = await detections();
  if (sessionId) {
    sessionId = requireId(sessionId, "Session ID");
    if (!(await getSessionById(userId, user.people[0]._id, sessionId)))
      throw new StatusError(404, "Session does not exist.");
    const res = await detectionsCol.updateOne(
      { _id: detectionId },
      { $set: { sessionId } }
    );
    if (!res.acknowledged)
      throw new Error("Failed to update detection session.");
  } else {
    const res = await detectionsCol.updateOne(
      { _id: detectionId },
      { $set: { sessionId: null } }
    );
    if (!res.acknowledged)
      throw new Error("Failed to update detection session.");
  }
};

/**
 * Runs the prediction model on a given file.
 * @param {Buffer} fileBuffer A file buffer object straight from the web request
 * @model This method must be updated with the correct input and output shape if the mode is changed.
 */
export const runDetection = async (fileBuffer) => {
  const data = requireData(fileBuffer);
  const prediction = model.predict(tf.tensor3d([data]));
  const result = await prediction.data();
  return [result[1] > result[0], Math.max(result[0], result[1])];
};

/**
 * Refit the model based on currently flagged detections.
 * @model This method must be updated with the correct input shape if the model is changed.
 */
export const refit = async () => {
  const detectionsCol = await detections();
  const flaggedDetections = await detectionsCol.find({ flagged: true }).toArray();
  const x = [];
  const y = [];
  for (const { truth, data } of flaggedDetections) {
    x.push(requireData(data));
    y.push([+!truth, +truth]);
  }

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metric: ['accuracy']
  });
  await model.fit(tf.tensor3d(x), tf.tensor2d(y));

  // Flip all the flagged detections to the correct value now that
  // they've been used, and unflag them
  await detectionsCol.updateMany(
    { flagged: true },
    [{
      $set: {
        flagged: false,
        truth: { $not: "$truth" }
      }
    }]
  );
};

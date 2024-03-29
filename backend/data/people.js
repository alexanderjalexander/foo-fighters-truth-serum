import { ObjectId } from "mongodb";
import { users } from "../config/mongo.js";
import { StatusError, checkPersonName, requireId, stringifyId } from "../validation.js";
import { getUserById } from "./users.js";

/**
 * @typedef Person
 * @property {ObjectId} _id The ObjectID for this Person
 * @property {string} name The name of this Person
 * @property {import("./detections.js").Detection[]} detections The detections stored on this Person 
 */

/**
 * Gets a Person from a given User.
 * @param {string|ObjectId} userId The ID of the User with the Person.
 * @param {string} personName The name of the Person to get.
 * @returns {Promise<Person?>} The Person, or null if they couldn't be found.
 */
export const getPersonByName = async (userId, personName) => {
  userId = requireId(userId);

  if (!(await getUserById(userId)))
    throw new StatusError(404, 'User does not exist.');

  const usersCol = await users();
  const userPerson = await usersCol.findOne(
    {
      _id: userId,
      people: { 
        $elemMatch: {
          name: personName
        }
      }
    },
    {
      projection: {
        "people.$": 1
      }
    }
  );

  return userPerson ? stringifyId(userPerson.people[0]) : null;
};

/**
 * Gets a Person from a given User.
 * @param {string|ObjectId} userId The ID of the User that has the Person.
 * @param {string|ObjectId} personId The ID of the Person to get.
 * @returns {Promise<Person?>} The Person, or null if they couldn't be found.
 */
export const getPersonById = async (userId, personId) => {
  userId = requireId(userId, "User id");
  personId = requireId(personId, "Person id")

  if (!(await getUserById(userId)))
    throw new StatusError(404, 'User does not exist.');

  const usersCol = await users();
  const userPerson = await usersCol.findOne(
    {
      _id: userId,
      people: { 
        $elemMatch: {
          _id: personId
        }
      }
    },
    {
      projection: {
        "people.$": 1
      }
    }
  );

  return userPerson ? stringifyId(userPerson.people[0]) : null;
};

/**
 * Creates a new Person on a given User with a given name.
 * @param {string|ObjectId} userId The ID of the user to create the Person on.
 * @param {string} personName The name to give the new Person.
 * @returns {Promise<Person>} The created Person.
 */
export const createPerson = async (userId, personName) => {
  userId = requireId(userId, 'User ID');
  personName = checkPersonName(personName);

  if (!(await getUserById(userId)))
    throw new StatusError(404, 'User does not exist.');

  if (await getPersonByName(userId, personName))
    throw new StatusError(400, 'A person with that name exists already.');

  const person = {
    _id: new ObjectId(),
    name: personName,
    detections: []
  };

  const usersCol = await users();
  const res = await usersCol.updateOne(
    { _id: userId },
    { $push: { people: person } }
  );
  if (!res.acknowledged)
    throw new Error('Failed to add person to user.');

  return stringifyId(person);
};

/**
 * Updates a Person's name.
 * @param {string|ObjectId} userId The ID of the User that contains the Person.
 * @param {string|ObjectId} personId The ID of the Person to modify.
 * @param {string} newName The new name for the Person.
 * @returns {Promise<import("./users.js").User>} The updated User data.
 */
export const renamePerson = async (userId, personId, newName) => {
  userId = requireId(userId, 'User ID');
  personId = requireId(personId, 'Person ID');
  newName = checkPersonName(newName);

  if (!(await getPersonById(userId, personId)))
    throw new StatusError(404, 'Person does not exist.');

  const usersCol = await users();
  const res = await usersCol.updateOne(
    {
      _id: userId,
      people: {
        $elemMatch: {
          _id: personId
        }
      }
    },
    {
      $set: {
        "people.$.name": newName
      }
    }
  );

  if (!res.acknowledged)
    throw new Error('Failed to update person\'s name.');

  return await getUserById(userId);
};

/**
 * Deletes a Person from a User.
 * @param {string|ObjectId} userId The ID of the User containing the Person.
 * @param {string|ObjectId} personId The ID of the Person to delete.
 * @returns {Promise<import("./users.js").User>} The updated User data.
 */
export const deletePerson = async (userId, personId) => {
  userId = requireId(userId, 'User ID');
  personId = requireId(personId, 'Person ID');

  if (!(await getPersonById(userId, personId)))
    throw new StatusError(404, 'Person does not exist.');

  const usersCol = await users();
  const res = await usersCol.updateOne(
    {
      _id: userId,
      "people._id": personId
    },
    {
      $pull: {
        people: {
          _id: personId
        }
      }
    }
  );

  if (!res.acknowledged)
    throw new Error('Failed to delete person.');

  return await getUserById(userId);
};

/**
 * Gets all Detections from a Person.
 * @param {string|ObjectId} userId The ID of the User containing the Person.
 * @param {string|ObjectId} personId The ID of the Person with the Detections.
 * @returns {Promise<import("./detections.js").Detection[]>} The Detections.
 */
export const getAllDetections = async (userId, personId) => {
  userId = requireId(userId, 'User ID');
  personId = requireId(personId, 'Person ID');

  const usersCol = await users();
  return await usersCol.aggregate([
    { $match: { _id: userId } },
    { $unwind: '$people' },
    { $match: { 'people._id': personId } },
    { $unwind: '$people.detections' },
    {
      $lookup: {
        from: 'detections', 
        localField: 'people.detections', 
        foreignField: '_id', 
        as: 'detection'
      }
    },
    { $unwind: '$detection' },
    { $replaceRoot: { newRoot: '$detection' } },
    { $project: { data: 0, owner: 0 } }
  ]).toArray();
}

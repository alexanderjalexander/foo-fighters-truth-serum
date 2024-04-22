import { ObjectId } from "mongodb";

export class StatusError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Asserts that a value is of type string. Errors if it isn't.
 * @param {any} value Value to assert a string type on.
 * @param {string} name Name of parameter for error messages.
 * @param {boolean} [trim] Whether the string should be trimmed. Default `true`.
 * @returns {string} Optionally trimmed string.
 */
export const requireString = (value, name, trim = true) => {
  if (!value || typeof value !== 'string' || (trim && !(value = value.trim())))
    throw new StatusError(400, `${name} must be a non-empty string.`);
  return value;
};

/**
 * Asserts that a value is of type ObjectId or equivalent. Errors if it isn't.
 * @param {string|ObjectId} value Value to assert an ObjectId type on.
 * @param {string} name Name of parameter for error messages.
 * @returns {ObjectId} The value coerced to an ObjectId.
 */
export const requireId = (value, name) => {
  if (!value || !ObjectId.isValid(value))
    throw new StatusError(400, `${name} must be a valid ID.`);
  return new ObjectId(value);
}

/**
 * Validates an email address. Errors if invalid.
 * @param {string} value Email address to check for validity.
 * @returns {string} Trimmed email address.
 */
export const checkEmail = (value) => {
  value = requireString(value, 'Email');
  if (!(/^[^@]+@[a-z0-9.-]+\.[a-z]{2,}$/i).test(value))
    throw new StatusError(400, "Provided email address isn't valid.");
  return value;
};

/**
 * Validates a password. Errors if invalid.
 * @param {string} value 
 */
export const checkPassword = (value) => {
  requireString(value, 'Password', false);
  if (value.length < 10)
    throw new StatusError(400, "Password must be at least 10 characters long.");
  if (!(/[a-z]/).test(value))
    throw new StatusError(400, "Password must have at least 1 lower case letter.");
  if (!(/[A-Z]/).test(value))
    throw new StatusError(400, "Password must have at least 1 upper case letter.");
  if (!(/[0-9]/).test(value))
    throw new StatusError(400, "Password must have at least 1 number.");
  if (!(/[^a-zA-Z0-9]/).test(value))
    throw new StatusError(400, "Password must have at least 1 non alphanumeric character.");
};

/**
 * Converts all `_id` fields in an object to strings.
 * Also works on nested objects.
 * @param {any} obj Object to convert `_id` fields on.
 * @returns {any} Stringified object.
 */
export const stringifyId = (obj) => {
  if (obj instanceof ObjectId)
    return obj.toString();
  for (const key in obj) {
    if (key === '_id')
      obj._id = obj._id.toString();
    else if (typeof obj[key] === 'object')
      obj[key] = stringifyId(obj[key]);
  }
  return obj;
};

/**
 * Checks that a person's name is valid. Errors if it isn't.
 * @param {string} name The name to check.
 * @returns {string} The trimmed name.
 */
export const checkPersonName = (name) => {
  name = requireString(name, 'Person name');
  if (name.length < 3)
    throw new StatusError(400, 'Person name must be at least 3 characters long.');
  return name;
};

/**
 * Checks that uploaded detection data is valid.
 * @param {Buffer} data The raw buffer with the data
 * @returns {number[][]} The parsed data
 */
export const requireData = (data) => {
  if (!Buffer.isBuffer(data))
    throw new StatusError(400, 'Must submit a file.');
  const lines = data.toString().trim().split('\n');
  // Discard header row if present (detect by NaN prescence in first row)
  if (isNaN(lines[0].split(',')[0])) lines.shift();
  if (lines.length != 9600)
    throw new StatusError(400, `Expected 9600 rows of data, received ${lines.length}`);
  return lines.map((line, i) => {
    const cols = line.trim().split(',');
    if (cols.length != 5)
      throw new StatusError(400, `Expected 5 columns of data per row, but row ${i + 1} has ${cols.length}`);
    for (let j = 0; j < 5; j++) {
      if (isNaN(cols[j] = +cols[j]))
        throw new StatusError(400, `Not a number at row ${i + 1}, column ${j + 1}`);
    }
    return cols;
  });
};

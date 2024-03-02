/**
 * Asserts that a value is of type string. Errors if it isn't.
 * @param {any} value Value to assert a string type on.
 * @param {string} name Name of parameter for error messages.
 * @param {boolean} [trim] Whether the string should be trimmed. Default `true`.
 * @returns {string} Optionally trimmed string.
 */
export const requireString = (value, name, trim = true) => {
  if (!value || typeof value !== 'string' || (trim && !(value = value.trim())))
    throw new Error(`${name} must be a non-empty string.`);
  return value;
};

/**
 * Validates an email address. Errors if invalid.
 * @param {string} value Email address to check for validity.
 * @returns {string} Trimmed email address.
 */
export const checkEmail = (value) => {
  value = requireString(value, 'Email');
  if (!(/^[^@]+@[a-z0-9.\-]+\.[a-z]{2,}$/i).test(value))
    throw new Error("Provided email address isn't valid.");
  return value;
};

/**
 * Validates a password. Errors if invalid.
 * @param {string} value 
 */
export const checkPassword = (value) => {
  requireString(value, 'Password', false);
  if (value.length < 10)
    throw new Error("Password must be at least 10 characters long.");
  if (!(/[a-z]/).test(value))
    throw new Error("Password must have at least 1 lower case letter.");
  if (!(/[A-Z]/).test(value))
    throw new Error("Password must have at least 1 upper case letter.");
  if (!(/[0-9]/).test(value))
    throw new Error("Password must have at least 1 number.");
  if (!(/[^a-zA-Z0-9]/).test(value))
    throw new Error("Password must have at least 1 non alphanumeric character.");
};

/**
 * Converts all `_id` fields in an object to strings.
 * Also works on nested objects.
 * @param {any} obj Object to convert `_id` fields on.
 * @returns {any} Stringified object.
 */
export const stringifyId = (obj) => {
  for (const key in obj) {
    if (key === '_id')
      obj._id = obj._id.toString();
    else if (typeof obj[key] === 'object')
      obj[key] = stringifyId(obj[key]);
  }
  return obj;
};

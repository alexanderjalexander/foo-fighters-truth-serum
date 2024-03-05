/**
 * Validates an email address.
 * @param {string} value Email address to check for validity.
 * @returns {string} Error message if invalid, or empty string if valid.
 */
export const checkEmail = (value) => {
    if (!(/^[^@]+@[a-z0-9.\-]+\.[a-z]{2,}$/i).test(value))
        return ("Provided email address isn't valid.");
    return "";
};

/**
 * Validates a password.
 * @param {string} value Email add
 * @returns {string} Error message if invalid, or empty string if valid
 */
export const checkPassword = (value) => {
    if (value.length < 10)
        return ("Password must be at least 10 characters long.");
    if (!(/[a-z]/).test(value))
        return ("Password must have at least 1 lower case letter.");
    if (!(/[A-Z]/).test(value))
        return ("Password must have at least 1 upper case letter.");
    if (!(/[0-9]/).test(value))
        return ("Password must have at least 1 number.");
    if (!(/[^a-zA-Z0-9]/).test(value))
        return ("Password must have at least 1 non alphanumeric character.");
    return "";
};
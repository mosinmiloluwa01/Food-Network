import bcrypt from 'bcryptjs';

/**
 * @param {string} password
 * @return {string} hash
 */
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export default hashPassword;

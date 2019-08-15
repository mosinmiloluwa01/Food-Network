/* eslint-disable import/prefer-default-export */
import model from '<models>';
import {
  displayMessage, cookieGenerator, sendMail, comparePassword
} from '<helpers>/utils';
import generateEmail from '<emailTemplates>/emailVerification';

const { User } = model;

export const signup = async (req, res) => {
  const {
    email, firstName, lastName
  } = req.body;

  const data = {
    email,
    firstName,
    lastName,
    password: req.body.password
  };
  try {
    const newUser = await User.create(data);

    const { password, ...userInfo } = newUser.dataValues;

    const payload = {
      id: newUser.id,
      isVerified: newUser.isVerified
    };

    cookieGenerator(payload, process.env.COOKIE_EXPIRY_DATE, res);

    const verificationEmail = generateEmail(newUser, req);

    await sendMail(
      process.env.SENDGRID_API_KEY,
      newUser.email,
      process.env.SENDGRID_FROM,
      'Email Verification',
      verificationEmail
    );

    return displayMessage(res, 200, 'success, please go to your inbox to verify your account', userInfo);
  } catch (error) {
    return displayMessage(res, 500, error.message, null, false);
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    const updatedUser = await user.update({ isVerified: true });

    const { isVerified } = updatedUser.dataValues;

    return displayMessage(res, 200, 'User email verified successfully', { isVerified });
  } catch (error) {
    return displayMessage(res, 500, 'an error occured', error, false);
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  try {
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return displayMessage(res, 400, 'Authentication failed', null, false);
    }
    const { password, ...userInfo } = userData.dataValues;


    if (userData && !comparePassword(userData.password, req.body.password)) {
      return displayMessage(res, 400, 'Authentication failed', null, false);
    }
    const payload = {
      id: userData.id,
      isVerified: userData.isVerified
    };

    cookieGenerator(payload, process.env.COOKIE_EXPIRY_DATE, res);

    return displayMessage(res, 200, 'Authentication successful', userInfo);
  } catch (error) {
    return displayMessage(res, 500, 'server error', error, false);
  }
};

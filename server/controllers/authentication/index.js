/* eslint-disable import/prefer-default-export */
import model from '<models>';
import {
  displayMessage, tokenGenerator, sendMail, comparePassword
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

    const token = tokenGenerator(payload, process.env.TOKEN_EXPIRY_DATE, process.env.SECRET);

    const verificationEmail = generateEmail(newUser, req);

    await sendMail(
      process.env.SENDGRID_API_KEY,
      newUser.email,
      process.env.SENDGRID_FROM,
      'Email Verification',
      verificationEmail
    );

    userInfo.token = token;

    return displayMessage(res, 200, {
      message: 'success, please go to your inbox to verify your account', data: userInfo
    });
  } catch (error) {
    return displayMessage(res, 500, { message: 'an error occured', error: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    const updatedUser = await user.update({ isVerified: true });

    const { isVerified } = updatedUser.dataValues;

    return displayMessage(res, 200, { message: 'User email verified successfully', isVerified });
  } catch (error) {
    return displayMessage(res, 500, { message: 'an error occured', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  try {
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return displayMessage(res, 400, { message: 'Authentication failed' });
    }
    const { password, ...userInfo } = userData.dataValues;


    if (userData && !comparePassword(userData.password, req.body.password)) {
      return displayMessage(res, 400, { message: 'Authentication failed' });
    }
    const payload = {
      id: userData.id,
      isVerified: userData.isVerified
    };

    const token = tokenGenerator(payload, process.env.TOKEN_EXPIRY_DATE, process.env.SECRET);

    userInfo.token = token;

    return displayMessage(res, 200, { message: 'Authentication successful', data: userInfo });
  } catch (error) {
    return displayMessage(res, 500, { message: 'an error occured', error: error.message });
  }
};

import { tokenGenerator } from '<helpers>/utils';
import { APP_NAME, getMailGenerator } from '<emailTemplates>/config';

const emailTemplate = link => ({
  body: {
    intro: `Welcome to ${APP_NAME}!`,
    action: {
      instructions:
        "You're almost there. To finish activating your account please click the link below. Please ensure you do this within 24 hours",
      button: {
        color: '#B02091',
        text: 'Activate Account',
        link
      }
    },
    outro: 'If you did not initiate this request, please ignore this mail.'
  }
});

const generateEmail = (user) => {
  const { FRONT_END_HOST } = process.env;
  const payload = { id: user.id, isVerified: false };
  const token = tokenGenerator(payload, process.env.TOKEN_EXPIRY_DATE, process.env.SECRET);
  const mailGenerator = getMailGenerator(FRONT_END_HOST);
  const link = emailTemplate(`${FRONT_END_HOST}/verify?token=${token}`);
  const email = mailGenerator.generate(link);
  return email;
};

export default generateEmail;

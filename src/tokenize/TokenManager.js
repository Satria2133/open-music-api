const jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = jwt.token.decode(refreshToken);
      // Verify the signature and obtain the decoded payload
      const decodedPayload = jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      // Destructure the payload from the decodedPayload
      const { payload } = decodedPayload;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;

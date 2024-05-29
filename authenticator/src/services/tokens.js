const jwt = require('jsonwebtoken');
const {handleResponse} = require('../helpers');
const {JWT_SECRET} = process.env;


const generateToken = (user) => new Promise((resolve, reject) => {
  jwt.sign(
      {
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
      JWT_SECRET,
      {expiresIn: '2h'},
      (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
  );
});

const checkToken = async (ctx) => {
  try {
    const token = ctx.request.headers.authorization.split(' ')[1];
    await jwt.verify(
      token,
      JWT_SECRET,
      async (error, authData) => {
        if (error) {
          handleResponse(ctx)(403, {mesage: error});
        } else {
          console.log(authData);
          handleResponse(ctx)(200, null);
        }
      },
    );
  } catch (err) {
    handleResponse(ctx)(403, null);
    return;
  }
};


module.exports = { generateToken, checkToken };
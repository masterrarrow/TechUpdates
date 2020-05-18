const jwt = require('jsonwebtoken');


module.exports = tokenGenerator = (user_id) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                user: user_id
            },
            process.env.SESSION_SECRET,
            {
                expiresIn: '1d'
            }, (err, emailToken) => {
                if (err) reject(err);
                resolve(emailToken);
            }
        );
    });
};

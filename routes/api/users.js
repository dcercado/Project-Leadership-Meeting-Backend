

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');


/**
 * @route post api/users/register
 * @desc Register the User
 * @access Public
 */

router.post('/register', (req, res) => {
    let { name,
        username,
        email,
        password,
        confirm_password
    } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            msq: "Password do not match.",
            check: password !== confirm_password,
            password: password,
            confirm_password: confirm_password
        });
    }
    //Check for the unique Email
    /*User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "User is already taken."
            });
        }
    });*/
    // check for the unique Email
    User.findOne({ email: email }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Email is already registered. Did you forget you password?"
            });
        }
    });

    //The data is valid and now we can register the user
    let newUser = new User({
        name,
        username: email,
        password,
        email
    });

    //Hash the password
    bcrypt.genSalt(8, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Nice, user is now registered."
                });
            })
                .catch((error) => {
                    console.log("Error saving user: ", error)
                });
        });

    });
});

/**
 * @route post api/users/login
 * @desc Signin the User
 * @access Public
 */

router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "Email is not found.",
                success: false
            });

        }
        //If there user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                //User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, key, { expiresIn: 604800 },
                    (err, token) => {
                        res.status(200).json({
                            success: true,
                            token: 'Bearer ${token}',
                            user: user,
                            msg: "Hurry! You are now logged in."
                        });
                    })
            } else {
                return res.status(404).json({
                    msg: "Incorrect password.",
                    success: false

                });
            }

        })

    });
});

/**
 * @route post api/users/profile
 * @desc Signin the User's Data
 * @access Private
 */
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json({
        user: req.user
    });
});

module.exports = router;


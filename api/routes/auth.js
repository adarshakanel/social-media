const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require("bcrypt");
//Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // generate new password that is hashed
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        // create new User with hashed password
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPass,
        })
        // save user and return response status
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // find if email exists
        const user = await User.findOne({
            email: email
        });

        // if email doesnt exist status = 404
        !user && res.status(404).json("user not found");

        // compare unhashed and unsalted password to salted and hashed password
        const validPassword = await bcrypt.compare(password, user.password);

        // if its not correct password, status = 400
        !validPassword && res.status(400).json("password is not correct");
        // if its correct password, status = 200 and send back user info
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router
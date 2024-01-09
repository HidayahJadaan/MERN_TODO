const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
} = require('../models/User');

// =================================================================
/*
@desc Register new user
@method POST
@route api/auth/register
@access public
*/
const register = asyncHandler(async (req, res) => {
    // VALIDATION
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    // EMAIL CHECKING
    if (user) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    const userCreated = await newUser.save();

    const token = jwt.sign({ id: userCreated._id, isAdmin: userCreated.isAdmin }, process.env.JWT_SECRET_KEY);
    const { password, ...other } = userCreated._doc;

    res.status(201).json({ ...other, token });
});

// =================================================================
/*
@desc Login user
@method POST
@route api/auth/login
@access public
*/
const login = asyncHandler(async (req, res) => {
    // VALIDATION
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    // CHECKING Credentials From User's Email
    if (!user) {
        return res.status(400).json({ error: 'INVALID EMAIL OR PASSWORD' });
    }

    const isPasswordsMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordsMatch) {
        return res.status(400).json({ error: 'INVALID EMAIL OR PASSWORD' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY);
    const { password, ...other } = user._doc;

    res.status(201).json({ ...other, token });
});


module.exports = {
    register,
    login
}

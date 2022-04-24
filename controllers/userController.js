const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const nodemailer= require('../config/nodemailer')
const passport = require("passport");
const {Strategy: FacebookStrategy} = require("passport-facebook");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET)
    const temp_secret = speakeasy.generateSecret();
    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
        confirmationCode: token,
        tempSecret: temp_secret.base32
    })

    if (user) {
        nodemailer.sendConfirmationEmail(
            user.name,
            user.email,
            user.confirmationCode);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            conf: user.confirmationCode,
            secret: user.tempSecret,
        })

    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        /*if (user.status != "Active") {
            return res.status(401).send({
                message: "Pending Account. Please Verify Your Email!",
            });
        }*/
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

//update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not connected')
    }

    // Make sure the logged in user matches the goal user
    if (user._id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).select('-password')

    res.status(200).json(updatedUser)
})

//delete
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400)
        throw new Error('user not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not connected')
    }

    // Make sure the logged in user matches the goal user
    if (user._id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await user.remove()

    res.status(200).json({ id: req.params.id })
})

//get all users for admin
const getAll = asyncHandler(async (req, res) => {
    const {name, email, role}= req.query
    let condition={}

    if(name){
        condition.name={$regex: name}
    }
    if(email) condition.email={$regex: email}
    if(role) condition.role={$regex: role}
    const users= await User.find(condition)
    res.status(200).json(users).select('-password')
})

const verifyUser = (req, res, next) => {
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            user.status = "Active";
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id),
                })
            });
        })
        .catch((e) => console.log("error", e));
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

const verifySecret= async (req,res) => {
    const { userId, token } = req.body;
    try {
        // Retrieve user from database
        const user= await User.findById(userId)
        const secret  = user.tempSecret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });
        if (verified) {
            // Update user data
            res.json({ verified: true })
        } else {
            res.json({ verified: false})
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user'})
    };
}





module.exports = {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser,
    verifyUser,
    verifySecret,
}

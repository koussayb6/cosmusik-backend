const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const nodemailer= require('../config/nodemailer')
const passport = require("passport");
const {Strategy: FacebookStrategy} = require("passport-facebook");
const QRCode = require('qrcode');


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
        res.status(400).json({message: "User already exists"} )
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET)
    const temp_secret = speakeasy.generateSecret();
    // Get the data URL of the authenticator URL
    const qrData = await QRCode.toDataURL(temp_secret.otpauth_url)
    console.log(qrData)
    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
        confirmationCode: token,
        tempSecret: temp_secret.base32,
        secretQR: qrData,
    })

    if (user) {
        nodemailer.sendConfirmationEmail(
            user.name,
            user.email,
            user.confirmationCode);

        res.status(201).json({

            message: `a confirmation email has been sent to ${user.email}`,
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
        if (user.status != "Active") {
            return res.status(401).json({
                message: "Pending Account. Please Verify Your Email!",
            });
        }
        if(user.twoFactor){
           return res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                twoFactor: true
            })
        }
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            otp: user.tempSecret,
            otpQR: user.secretQR,
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
    const users= await User.find(condition).select('-password')
    res.status(200).json(users)
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
                    otp: user.tempSecret,
                    otpQR: user.secretQR,

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
    const { name, token } = req.body;
    try {
        // Retrieve user from database
        const user= await User.findOne({name: name})
        const secret  = user.tempSecret;
        console.log(user.tempSecret)

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });
        console.log(verified)
        if (verified) {
            console.log(user.tempSecret)

            // Update user data
            user.twoFactor=true;
            await user.save()
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                otp: user.tempSecret,
                otpQR: user.secretQR,
                twoFactor: true})
        } else {
            res.status(400).json({ message: "invalid code"})
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user'})
    };
}

const activateTwoFactor= async (req,res) => {
    try {
        // Retrieve user from database
        const user= await User.findById(req.params.id)
        user.twoFactor=true
        const user1= await user.save()
        res.status(200).json(user1)
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user'})
    };
}
//get one user
const getOneUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
});
const searchForUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $and: [{ name: { $regex: req.query.search, $options: "i" } }],
            //     $and: [{ public: { $exists: true } }],
        }
        : {};

    const users = await userModel.find(keyword);
    res.send(users);

});



module.exports = {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser,
    verifyUser,
    verifySecret,activateTwoFactor,
    getOneUser,
    searchForUser
}

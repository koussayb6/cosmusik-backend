const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

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

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user"
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
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
    if(req.user.role!== "admin")
        res.status(401).end("not admin")
    const users= await User.find()
    res.status(200).json(users)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser
}

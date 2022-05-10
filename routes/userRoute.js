const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser, verifyUser, verifySecret, activateTwoFactor, searchForUser
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/otp', verifySecret)
router.get('/2fa/:id', activateTwoFactor)
router.get('/',  getAll)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)
router.get("/confirm/:confirmationCode", verifyUser)
router.get("/search", protect, searchForUser);


module.exports = router

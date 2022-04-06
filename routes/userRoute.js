const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser, verifyUser, verifySecret
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verifyS', verifySecret)
router.get('/', protect, getAll)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)
router.get("/confirm/:confirmationCode", verifyUser)


module.exports = router

const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    getAll,
    updateUser,
    deleteUser, verifyUser, verifySecret, followUser, unfollow
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verifyS', verifySecret)
router.get('/',  getAll)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)
router.get("/confirm/:confirmationCode", verifyUser)
router.route("/:id/follow").put(protect, followUser);
router.route("/:id/unfollow").put(protect, unfollow);

module.exports = router

const express = require('express')
const router = express.Router()
const {
    getAllVideo,
    getVideo,
    getTrending,
    addVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    filtreVideo
} = require('../controllers/videoController')


router.route('/').get(getAllVideo).post(addVideo)
router.route('/trending').get(getTrending)
router.route('/search').get(filtreVideo)
router.route('/:id').get(getVideo).put(updateVideo).delete(deleteVideo)
router.route('/like/:id').put(likeVideo)


module.exports = router

const express = require('express')
const router = express.Router()
const {
    getAllPlaylist,
    getPlaylist,
    addPlaylist,
    addVideoToPlaylist,
    updatePlaylist,
    deletePlaylist,
    deleteVideoFromPlaylist
} = require('../controllers/playlistController')


router.route('/').get(getAllPlaylist).post(addPlaylist)
router.route('/:id').get(getPlaylist).put(updatePlaylist).delete(deletePlaylist)
router.route('/:iduser').post(addPlaylist)
router.route('/:idplaylist/:idvideo').put(addVideoToPlaylist).delete(deleteVideoFromPlaylist)


module.exports = router

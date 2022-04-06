const express = require('express')
const router = express.Router()
const {
    getinstrument,
    setinstrument,
    updateinstrument,
    deleteinstrument,
    filtreInstrument

} = require('../controllers/instrumentController')
const {
    getcategory,
    setcategory,
    updatecategory,
    deletecategory,

} = require("../controllers/categoryInstrumentController");


router.route('/').get(getinstrument)
router.route('/category').get(getcategory).post(setcategory)
router.route('/search').get(filtreInstrument)
router.route('/:id').post(setinstrument).delete(deleteinstrument)
router.route('/:idinstrument/:idcategory').put(updateinstrument)
router.route('/category/:id').put(updatecategory).delete(deletecategory)





module.exports = router

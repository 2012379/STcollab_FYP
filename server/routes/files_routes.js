const router = require('express').Router()
const files_controller = require('../controller/files_controller')

router.get('/', files_controller.getFiles)

module.exports = router 
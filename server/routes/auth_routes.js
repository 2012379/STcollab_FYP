const router = require('express').Router()
const auth_controller = require('../controller/auth_controller')

router.post('/register', auth_controller.register)
router.post('/signin', auth_controller.signin)
router.post('/checkUnique', auth_controller.checkUnique)

module.exports = router 
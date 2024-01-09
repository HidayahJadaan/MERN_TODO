const express = require('express');
const {getForgotPasswordView, sendForgotPasswordLink, getResetPasswordView, resetThePassword} = require('../controllers/PasswordController');
const router = express.Router();

// =================================================================
/*
@desc Get forgot-password view
@method GET
@route /password/forgot-password
@access public
*/

router.route('/forgot-password').get(getForgotPasswordView).post(sendForgotPasswordLink);
router.route('/reset-password/:userId/:token').get(getResetPasswordView).post(resetThePassword);


module.exports = router;
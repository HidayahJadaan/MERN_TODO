const express = require("express");
const { getAllUsers, getUser, deleteUser, updateUser } = require("../controllers/usersControllers");
const { VerifyTokenAndAuthorization, VerifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();


router.put("/:id", VerifyTokenAndAuthorization, updateUser);
router.get('/', VerifyTokenAndAdmin,  getAllUsers);
router.get('/:id', VerifyTokenAndAuthorization, getUser );
router.delete('/:id', VerifyTokenAndAuthorization, deleteUser);

module.exports = router;

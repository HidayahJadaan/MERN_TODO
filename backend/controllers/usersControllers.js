const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {verifyToken, VerifyTokenAndAdmin, VerifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User");


// =================================================================
/*
@desc Get All users
@method GET
@route api/users
@access private (only admins)
*/
const getAllUsers =  asyncHandler (async (req,res)=>{

    const users = await User.find().select("-password");
    res.status(200).json(users);
});

// =================================================================
/*
@desc Get user
@method GET
@route api/users/:id
@access private (only admins and user himself)
*/
const getUser = asyncHandler( async (req,res)=>{

    const user  = await User.findById(req.params.id);
    if(user){
       return res.status(200).json(user);
   }
   else{

       return res.status(404).json({ error: "User not found" });
   }
});
// =================================================================

/*
@desc Update user
@method PUT
@route api/users/:id
@access private
*/

const updateUser =  asyncHandler(async (req, res) => {
    // // AUTHORIZATION CHECKING ...
    // 1. Without Middleware
    // if (req.user.id !== req.params.id) {
    //   // 403 --> Forbidden
    //   return res.status(403).json({ error: "Unauthorized Access!!, You only can update your data" });
    // }

    // 2. With Middleware



    // VALIDATION
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // // HASHING THE PASSWORD
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    // UPDATING USER
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  });

  // =================================================================
/*
@desc Delete user
@method DELETE
@route api/users/:id
@access private (only admins and user himself)
*/

const deleteUser = asyncHandler( async (req,res)=>{

    const user  = await User.findById(req.params.id);
    if (user) {
        await User.findByIdAndDelete(req.params.id);
       return res.status(200).json({message: "User Is Deleted Successfully"});
    }
    else{

        return res.status(404).json({ error: "User not found" });
    }
});

module.exports= {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}
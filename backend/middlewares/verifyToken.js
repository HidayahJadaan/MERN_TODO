const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message:"Invalid Token"});
    }
  } else {
    res
      .status(401)
      .json({ message: "Unauthorized Access!!, No Token Provided" });
  }
}

// Verify Token And Authorize The User
function VerifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({message:"Unauthorized Access!!, You are not allowed"});
        }
    })
}

// Verify Token And Admin
function VerifyTokenAndAdmin(req, res, next){
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({message:"Unauthorized Access!!, Only Admins"});
        }
    })
}
module.exports = {verifyToken, VerifyTokenAndAdmin, VerifyTokenAndAuthorization };

const User = require('../models/User');

//@dest     Register user
//@route    Post /api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    try{
        const {name, telephone, email, password, role} = req.body;
        
        //Create user
        const user = await User.create({
            name,
            telephone,
            email,
            password,
            role
        });
        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}

//@dest     Login user
//@route    Post /api/v1/auth/login
//@access   Public
exports.login = async (req,res,next) => {
    try{
        const {email,password} = req.body;

        //Validate email & password
        if(!email || !password){
            return res.status(400).json({success:false, msg:'please provide an email and password'});
        }

        //Check for user
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({success: false, msg: 'Invalid credentials'});
        }

        //Check if password match
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({success: fals, msg: 'Invalid credentials'});
        }

        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true, token});
        sendTokenResponse(user,200,res);
    }
    catch(err){
        return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
    }
}

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const option ={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NOSE_ENV === 'production') {
        option.secure = true;
    }
    res.status(statusCode).cookie('token', token, option).json({
        success: true,
        token
    })
}

//@dest     Get current logged in user
//@route    Get /api/v1/auth/me
//@access   private
exports.getMe = async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

//@dest     Log user out / clear cookie
//@route    Get /api/v1/auth/logout
//@access   private
exports.logout = async(req, res, next) => {
    res.cookie('token','none', {
        expires: new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};
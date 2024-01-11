import User from '../models/User.js'

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(200).json({
                success: false,
                message: 'All Fields Are Required'
            })
        }
        const isUser = await User.findOne({ email })
        if (isUser) {
            return res.status(200).json({
                success: false,
                message: 'User Already Registerd'
            })
        }
        const user = new User({
            name,
            email,
            password
        })
        const response = await user.save()
        if (!response) {
            return res.status(200).json({
                success: false,
                message: 'User Registeration Failed'
            })
        }
        res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({
                success: false,
                message: 'All Fields Are Required'
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User Not Exists, Please Sign Up'
            })
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(200).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        const token = await user.generateToken()
        res.status(200).json({
            success: true,
            message: 'User Logged In Successfully',
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
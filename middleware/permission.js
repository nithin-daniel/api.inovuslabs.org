const sessionHandling = require('.././models/sessionHandling');
const User = require('.././models/users');

const permissionValidator = async(req,res,next)=>{
    // const token = req.header('Authorization');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pdGhpbmRhbmllbDIwMThAZ21haWwuY29tIiwiaWF0IjoxNzExMjQ2ODUxLCJleHAiOjE3MTEzMzMyNTF9.a4b1lmH2f2LyLNcQ_z_tkCBci-0986c5h_A5jppBkk0"
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized',
            error: 'Access denied'
        });
    }else{
        const tokenValidation = await sessionHandling.find({ token:token });
        const tokenAuthor = tokenValidation[0]['author']
        // console.log(tokenAuthor);
        const author = await User.find({ email:tokenAuthor });
        console.log(author[0]['roles']);
        next();
    }




}

module.exports = permissionValidator;
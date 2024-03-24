const sessionHandling = require('.././models/sessionHandling');

const sessionVerify = async(req,res)=>{
    
    try{
        // const token = req.header('Authorization');
        
        // const bearer = token.split(' ');
        // const bearerToken = bearer[1];
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pdGhpbmRhbmllbDIwMThAZ21haWwuY29tIiwiaWF0IjoxNzExMjQ2ODUxLCJleHAiOjE3MTEzMzMyNTF9.a4b1lmH2f2LyLNcQ_z_tkCBci-0986c5h_A5jppBkk0"
        const session = await sessionHandling.findOne({ token });
        console.log(session.verified);
        if (!session) {
            return res.status(401).json({
                status: 401,
                error: 'Token not found'
            });
        }else if(!session.token===token){
            session.verified=false;
            return res.status(401).json({
                error:'Token Expired'
            })
        }else{
            return res.sendStatus(200)
        }    
    }catch(error){
        return res.sendStatus(400)
    }
} 

module.exports = sessionVerify;
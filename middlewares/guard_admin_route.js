const jwt = require('jsonwebtoken');

function guardAdminRoute(req, res, next)
{
    const token = req.cookies.token;

    if(!token) return res.redirect('/root/login');

    try
    {
        const data = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        next();
    }
    catch(ex)
    {
        console.log('Error, when decoding token')
        return res.redirect('/root/login')
    }
}

module.exports = guardAdminRoute;
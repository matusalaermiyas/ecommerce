module.exports = (err, req, res, next) => {
    console.log("Error in middleware")
    console.log(err)
    return res.render('error', {isLogged: req.session.isLogged})
};
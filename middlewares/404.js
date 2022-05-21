module.exports = (req, res, next) => {
    return res.status(404).send("404 page not found");
}
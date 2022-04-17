const errorHandler = (err, req, res, next) => {
    // If statusCode property is present in error, statusCode is set to a new variable statusCode
    const statusCode = err.statusCode ? err.statusCode : 500
    res.status(statusCode)
    res.send({ message: err.message })
}

module.exports = { errorHandler }
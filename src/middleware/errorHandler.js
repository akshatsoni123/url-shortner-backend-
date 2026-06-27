function errorHandler(err, req, res, next) {
    // statusCode set in urlService (400, 409, 500) or default 500
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      error: err.message || 'Internal server error',
    });
  }
  
  module.exports = errorHandler;
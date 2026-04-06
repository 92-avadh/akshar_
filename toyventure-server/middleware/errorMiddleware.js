const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const errorPayload = {
    level: 'error',
    type: 'request_error',
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message || 'Internal Server Error',
  };

  if (!isProduction && err.stack) {
    errorPayload.stack = err.stack;
  }

  console.error(JSON.stringify(errorPayload));

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    requestId: req.requestId,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };

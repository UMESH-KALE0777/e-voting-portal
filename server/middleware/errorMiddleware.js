// server/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  
  console.error(`❌ [${req.method}] ${req.originalUrl} —`, err.message);

  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "Internal server error";

   
  if (err.name === "ValidationError") {
    statusCode = 400;
    
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

   
  else if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    const fieldLabels = {
      email:         "Email address",
      voterId:       "Voter ID",
      aadhaarNumber: "Aadhaar number",
      voteHash:      "Vote hash",
      voter:         "Voter",
    };
    message = `${fieldLabels[field] || field} already exists.`;
  }

   
  else if (err.name === "CastError") {
    statusCode = 404;
    message = `${err.path} not found.`;
  }

 
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again.";
  }

  
  else if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 2MB.";
    } else {
      message = err.message;
    }
  }

  
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
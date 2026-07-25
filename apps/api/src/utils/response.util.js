export class ResponseUtil {
  static success(res, data, status = 200) {
    return res.status(status).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message, status = 500, details = null) {
    return res.status(status).json({
      success: false,
      error: {
        message,
        details
      },
      timestamp: new Date().toISOString()
    });
  }
}

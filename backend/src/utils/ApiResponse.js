class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(data, message = "Success", statusCode = 200) {
    return new ApiResponse(statusCode, message, data);
  }

  static created(data, message = "Created successfully") {
    return new ApiResponse(201, message, data);
  }
}

export default ApiResponse;

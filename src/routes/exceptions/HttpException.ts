class HttpException extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export default HttpException;

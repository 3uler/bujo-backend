import HttpException from "./HttpException";

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export default NotFoundException;

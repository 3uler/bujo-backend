import HttpException from "./HttpException";

class ConflictException extends HttpException {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export default ConflictException;

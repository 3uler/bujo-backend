import HttpException from "./HttpException";

class InvalidInputException extends HttpException {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, InvalidInputException.prototype);
  }
}

export default InvalidInputException;

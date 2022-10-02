import HttpException from "./HttpException";

class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedException);
  }
}

export default UnauthorizedException;

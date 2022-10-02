import UnauthorizedException from "./UnauthorizedException";

class WrongAuthTokenException extends UnauthorizedException {
  constructor() {
    super("The authentication token is not valid");
    Object.setPrototypeOf(this, WrongAuthTokenException.prototype);
  }
}

export default WrongAuthTokenException;

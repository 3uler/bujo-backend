import UnauthorizedException from "./UnauthorizedException";

class MissingAuthTokenException extends UnauthorizedException {
  constructor() {
    super("The authentication token is missing.");
    Object.setPrototypeOf(this, MissingAuthTokenException.prototype);
  }
}

export default MissingAuthTokenException;

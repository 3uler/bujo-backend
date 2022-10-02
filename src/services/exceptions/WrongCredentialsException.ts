class WrongCredentialsException extends Error {
  constructor() {
    super("Wrong email address or password");
    Object.setPrototypeOf(this, WrongCredentialsException.prototype);
  }
}
export default WrongCredentialsException;

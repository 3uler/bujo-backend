class WrongCredentialsException extends Error {
  constructor() {
    super("Wrong email address or password");
    Object.setPrototypeOf(this, WrongCredentialsException);
  }
}
export default WrongCredentialsException;

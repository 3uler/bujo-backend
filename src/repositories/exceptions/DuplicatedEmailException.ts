class DuplicatedEmailException extends Error {
  constructor() {
    super("The given email address is already taken");
    Object.setPrototypeOf(this, DuplicatedEmailException.prototype);
  }
}
export default DuplicatedEmailException;

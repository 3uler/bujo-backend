class UserNotFoundException extends Error {
  constructor(id: string) {
    const message = `User with id ${id} not found.`;
    super(message);
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}

export default UserNotFoundException;

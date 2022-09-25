class MissingFieldsException extends Error {
  constructor(missingFields: string[]) {
    super(`The following fields are missing: ${missingFields.join(", ")}`);
    Object.setPrototypeOf(this, MissingFieldsException.prototype);
  }
}

export default MissingFieldsException;

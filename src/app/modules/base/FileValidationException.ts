export class FileValidationException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "FileValidationException";
    }
  }
export class ParseOptionsError extends Error {
  constructor(message = "BAD REQUEST", public argAttr?: string) {
    super(message);
    this.name = "ParseOptionsError";
  }
}

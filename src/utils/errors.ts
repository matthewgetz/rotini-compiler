export class RotiniDefinitionError extends Error {
  constructor ({ message, context, }: { message: string, context: string[] }) {
    const error_message = `${message}\nContext: ${context.join(' ')}\n`;

    super(error_message);
    this.name = 'RotiniDefinitionError';
  }
}

export class RotiniParseError extends Error {
  constructor ({ message, }: { message: string }) {
    super(message);
    this.name = 'RotiniParseError';
  }
}

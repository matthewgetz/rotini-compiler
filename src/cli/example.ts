import { RotiniExample, } from '../interfaces';
import { RotiniDefinitionError, } from '../utils/errors';
import {
  isNotDefined,
  isNotString,
} from '../utils/validations';

export class Example implements RotiniExample {
  description!: string;
  usage!: string;

  #context!: string[];

  constructor (example: RotiniExample, context: string[]) {
    this.#context = context;
    this
      .#setDescription(example.description)
      .#setUsage(example.usage);
  }

  #setDescription = (description: string): Example | never => {
    if (isNotDefined(description) || isNotString(description)) {
      throw new RotiniDefinitionError({
        message: 'Example property "description" must be defined, of type "string", and cannot be set as empty string.',
        context: this.#context,
      });
    }

    this.description = `# ${description}`;

    return this;
  };

  #setUsage = (usage: string): Example | never => {
    if (isNotDefined(usage) || isNotString(usage)) {
      throw new RotiniDefinitionError({
        message: 'Example property "usage" must be defined, of type "string", and cannot be set as empty string.',
        context: this.#context,
      });
    }

    this.usage = usage;

    return this;
  };
}

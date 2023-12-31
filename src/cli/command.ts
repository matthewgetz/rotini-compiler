import { RotiniArgument, RotiniCommand, RotiniExample, } from '../interfaces';
import { Argument, } from './argument';
import { Example, } from './example';
import { RotiniDefinitionError, } from '../utils/errors';
import {
  arrayOfStringsHasEntriesWithSpaces,
  isArray,
  isNotArray,
  isNotArrayOfStrings,
  isNotBoolean,
  isNotDefined,
  isNotEmptyArray,
  isNotString,
  stringContainsSpaces,
} from '../utils/validations';

export class Command implements RotiniCommand {
  name!: string;
  description!: string;
  aliases!: string[];
  deprecated!: boolean;
  arguments!: Argument[];
  commands!: Command[];
  examples!: Example[];

  must_be_forced!: boolean;
  has_subcommands!: boolean;
  subcommand_identifiers!: string[];

  #context!: string[];

  constructor (command: RotiniCommand, context: string[]) {
    this.#context = context;
    this.#context.push(command.name);
    this
      .#setName(command?.name)
      .#setDescription(command?.description)
      .#setAliases(command?.aliases)
      .#setDeprecated(command?.deprecated)
      .#setArguments(command?.arguments)
      .#setCommands(command?.commands)
      .#setExamples(command?.examples)
      .#setSubcommandIdentifiers();
  }

  #setName = (name: string): Command | never => {
    if (isNotDefined(name) || isNotString(name) || stringContainsSpaces(name)) {
      throw new RotiniDefinitionError({
        message: 'Required command property "name" must be defined, of type "string", cannot be set to empty string, and cannot contain spaces.',
        context: this.#context,
      });
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): Command | never => {
    if (isNotDefined(description) || isNotString(description)) {
      throw new RotiniDefinitionError({
        message: 'Required command property "description" must be defined, of type "string", and cannot be set as empty string.',
        context: this.#context,
      });
    }

    this.description = description;

    return this;
  };

  #setAliases = (aliases: string[] = []): Command | never => {
    if (isNotArray(aliases) || isNotArrayOfStrings(aliases) || arrayOfStringsHasEntriesWithSpaces(aliases)) {
      throw new RotiniDefinitionError({
        message: 'Optional command property "aliases" must be of type "string[]" and cannot have entries that contain spaces.',
        context: this.#context,
      });
    }

    this.aliases = isArray(aliases) ? aliases : [];

    return this;
  };

  #setDeprecated = (deprecated = false): Command | never => {
    if (isNotBoolean(deprecated)) {
      throw new RotiniDefinitionError({
        message: 'Optional command property "deprecated" must be of type "boolean".',
        context: this.#context,
      });
    }

    return this;
  };

  #setArguments = (args: RotiniArgument[] = []): Command | never => {
    if (isNotArray(args)) {
      throw new RotiniDefinitionError({
        message: 'Command property "arguments" must be of type "RotiniArgument[]".',
        context: this.#context,
      });
    }

    this.arguments = args.map(arg => new Argument(arg, this.#context));

    return this;
  };

  #setCommands = (commands: RotiniCommand[] = []): Command | never => {
    if (isNotArray(commands)) {
      throw new RotiniDefinitionError({
        message: 'Command property "commands" must be of type "RotiniCommand[]".',
        context: this.#context,
      });
    }

    this.commands = commands.map(command => new Command(command, this.#context));
    this.has_subcommands = isNotEmptyArray(commands);

    return this;
  };

  #setExamples = (examples: RotiniExample[] = []): Command | never => {
    if (isNotArray(examples)) {
      throw new RotiniDefinitionError({
        message: 'Command property "examples" must be of type "RotiniExample[]".',
        context: this.#context,
      });
    }

    this.examples = examples.map(example => new Example(example, this.#context));

    return this;
  };

  #setSubcommandIdentifiers = (): Command => {
    const potential_commands = this.commands.map(command => command.name);
    const potential_aliases = this.commands.map(command => command.aliases).flat();

    this.subcommand_identifiers = [ ...potential_commands, ...potential_aliases, ];

    return this;
  };
}

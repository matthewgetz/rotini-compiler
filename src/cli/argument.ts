import { RotiniArgument, } from '../interfaces';
import { RotiniDefinitionError, } from '../utils/errors';
import { getArgumentParserFunction, getArgumentValidatorFunction, } from '../utils/x';
import { DefaultParser, DefaultValidator, Parser, Type, TYPES, Validator, Values, Variant, VARIANTS, } from '../types';
import {
  isNotAllowedStringValue,
  isNotArray,
  isNotArrayOfBooleans,
  isNotArrayOfNumbers,
  isNotArrayOfStrings,
  isNotDefined,
  isNotFunction,
  isNotString,
  stringContainsSpaces,
} from '../utils/validations';

export class Argument implements RotiniArgument {
  name: string;
  description: string;
  variant: Variant;
  type: Type;
  values: Values;
  validator: Validator;
  parser: Parser;

  #context: string[];

  constructor (argument: RotiniArgument, context: string[]) {
    this.#context = context;

    this.name = this.#getName(argument.name);
    this.description = this.#getDescription(argument.description);
    this.variant = this.#getVariant(argument.variant);
    this.type = this.#getType(argument.type);
    this.values = this.#getValues(argument.values);
    this.validator = this.#getValidator(argument.validator);
    this.parser = this.#getParser(argument.parser);
  }

  #getName = (name: string): string | never => {
    if (isNotDefined(name) || isNotString(name) || stringContainsSpaces(name)) {
      throw new RotiniDefinitionError({
        message: 'Required argument property "name" must be defined, of type "string", cannot be set to empty string, and cannot contain spaces.',
        context: this.#context,
      });
    }

    return name;
  };

  #getDescription = (description: string): string | never => {
    if (isNotDefined(description) || isNotString(description)) {
      throw new RotiniDefinitionError({
        message: 'Required argument property "description" must be defined, of type "string", and cannot be set as empty string.',
        context: this.#context,
      });
    }

    return description;
  };

  #getVariant = (variant: Variant): Variant | never => {
    if (isNotString(variant) || isNotAllowedStringValue(variant, VARIANTS)) {
      throw new RotiniDefinitionError({
        message: 'Required argument property "variant" must be defined, of type "string", and must be set as "value", "boolean", or "variadic".',
        context: this.#context,
      });
    }

    return variant;
  };

  #getType = (type: Type): Type | never => {
    if (isNotString(type) || isNotAllowedStringValue(type, TYPES)) {
      throw new RotiniDefinitionError({
        message: 'Required argument property "type" must be defined, of type "string", and set as "string", "number", "boolean", "string[]", "number[]", or "boolean[]".',
        context: this.#context,
      });
    }

    if (this.variant === 'boolean' && type !== 'boolean') {
      throw new RotiniDefinitionError({
        message: 'Required argument property "type" must be set as "boolean" when property "variant" is set as "boolean".',
        context: this.#context,
      });
    }

    if (this.variant === 'variadic' && !type.includes('[]')) {
      throw new RotiniDefinitionError({
        message: 'Required argument property "type" must be set as "string[]", "number[]", or "boolean[]" when property "variant" is set as "variadic".',
        context: this.#context,
      });
    }

    return type;
  };

  #getValues = (values: Values = []): Values | never => {
    const isNotArrayOfType = Object.freeze({
      string: isNotArrayOfStrings,
      number: isNotArrayOfNumbers,
      boolean: isNotArrayOfBooleans,
      'string[]': isNotArrayOfStrings,
      'number[]': isNotArrayOfNumbers,
      'boolean[]': isNotArrayOfBooleans,
    })[this.type];

    const type = this.type.replace('[]', '');

    if (isNotArray(values) || isNotArrayOfType(values)) {
      throw new RotiniDefinitionError({
        message: `Optional argument property "values" must be of type "array" and can only contain indexes of type "${type}".`,
        context: this.#context,
      });
    }

    return values;
  };

  #getValidator = (validator: Validator = DefaultValidator): Validator | never => {
    if (isNotFunction(validator)) {
      throw new RotiniDefinitionError({
        message: 'Optional argument property "validator" must be of type "function".',
        context: this.#context,
      });
    }

    return getArgumentValidatorFunction({ name: this.name, validator, });
  };

  #getParser = (parser: Parser = DefaultParser): Parser | never => {
    if (isNotFunction(parser)) {
      throw new RotiniDefinitionError({
        message: 'Optional argument property "parser" must be of type "function".',
        context: this.#context,
      });
    }

    return getArgumentParserFunction({ name: this.name, parser, });
  };
}

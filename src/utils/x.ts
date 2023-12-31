import { RotiniParseError, } from '../utils/errors';
import { DefaultParser, DefaultValidator, Parser, Validator, ValueProperties, } from '../types';
import {
  isArray,
} from '../utils/validations';

const getParserFunction = <ParsedType>({ name, entity, parser = DefaultParser, }: { entity: 'Argument' | 'Flag', name: string, parser?: Parser }) => {
  return ({ original_value, coerced_value, }: ValueProperties): ParsedType => {
    const unknown_value = original_value as unknown;
    const unknown_coerced_value = coerced_value as unknown;
    try {
      const parsed = <ParsedType>parser({ original_value: unknown_value, coerced_value: unknown_coerced_value, });
      return parsed;
    } catch (error) {
      const bad_value = isArray(unknown_value) ? JSON.stringify(unknown_value) : unknown_value;
      throw new RotiniParseError({
        message: `${entity} value "${bad_value}" could not be parsed for ${entity.toLowerCase()} "${name}".`,
      });
    }
  };
};

export const getArgumentParserFunction = <ParsedType>({ name, parser = DefaultParser, }: { name: string, parser?: Parser }): (({ original_value, coerced_value, }: ValueProperties) => ParsedType) => {
  return getParserFunction({ entity: 'Argument', name, parser, });
};

export const getFlagParserFunction = <ParsedType>({ name, parser = DefaultParser, }: { name: string, parser?: Parser }): (({ original_value, coerced_value, }: ValueProperties) => ParsedType) => {
  return getParserFunction({ entity: 'Flag', name, parser, });
};

const getValidatorFunction = ({ name, entity, validator = DefaultValidator, }: { name: string, entity: 'Argument' | 'Flag', validator?: Validator }) => {
  return (properties: ValueProperties): boolean | never => {
    try {
      if (validator(properties) === false) {
        const value = properties.original_value as unknown;
        const bad_value = isArray(value) ? JSON.stringify(value) : value;
        throw new RotiniParseError({
          message: `${entity} value "${bad_value}" is invalid for ${entity.toLowerCase()} "${name}".`,
        });
      }
      return true;
    } catch (error) {
      throw new RotiniParseError({
        message: (error as Error).message,
      });
    }
  };
};

export const getArgumentValidatorFunction = ({ name, validator = DefaultValidator, }: { name: string, validator?: Validator }): (properties: ValueProperties) => boolean | never => {
  return getValidatorFunction({ entity: 'Argument', name, validator, });
};

export const getFlagValidatorFunction = ({ name, validator = DefaultValidator, }: { name: string, validator?: Validator }): (properties: ValueProperties) => boolean | never => {
  return getValidatorFunction({ entity: 'Flag', name, validator, });
};

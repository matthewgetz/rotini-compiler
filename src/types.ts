export const TYPES = [ 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]', ] as const;
export type Type = typeof TYPES[number];

export type Value = string | number | boolean | string[] | number[] | boolean[];
export type Values = string[] | number[] | boolean[];

export const VARIANTS = [ 'boolean', 'value', 'variadic', ] as const;
export type Variant = typeof VARIANTS[number];

export const STYLES = [ 'global', 'local', 'positional', ] as const;
export type Style = typeof STYLES[number];

export type ValueProperties = {
  original_value: any
  coerced_value: any
};

export type Validator = (properties: ValueProperties) => boolean | void | never;

export type Parser = (properties: ValueProperties) => unknown;

export type PositionalFlagOperation = (value: any) => Promise<unknown> | unknown

export const DefaultParser = (properties: ValueProperties): unknown => properties.coerced_value;

export const DefaultValidator = (): boolean => true;

export const DefaultPositionalFlagOperation = (): void => { };

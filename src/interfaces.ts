import { Type, Values, Variant, Validator, Parser, } from './types';

export interface RotiniArgument {
  name: string
  description: string
  variant: Variant
  type: Type
  values?: Values
  validator?: Validator
  parser?: Parser
}

export interface RotiniCommand {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  usage?: string
  arguments?: RotiniArgument[]
  commands?: RotiniCommand[]
  examples?: RotiniExample[]
}

export interface RotiniExample {
  description: string
  usage: string
}

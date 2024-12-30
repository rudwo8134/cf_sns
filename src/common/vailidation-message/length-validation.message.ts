import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 2) {
    return `nickname must be at least ${args.constraints[0]} character long and at most ${args.constraints[1]} characters long, please try again`;
  } else {
    return `nickname must be at least ${args.constraints[0]} character long, please try again`;
  }
};

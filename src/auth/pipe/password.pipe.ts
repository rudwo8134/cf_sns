import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: string) {
    if (value.toString().length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}
  transform(value: string) {
    if (value.toString().length > this.maxLength) {
      throw new BadRequestException(
        `Password must be less than ${this.maxLength} characters`,
      );
    }
    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}
  transform(value: string) {
    if (value.toString().length < this.minLength) {
      throw new BadRequestException(
        `Password must be at least ${this.minLength} characters`,
      );
    }
    return value.toString();
  }
}

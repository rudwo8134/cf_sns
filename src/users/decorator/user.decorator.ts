import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException('User property is not found');
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);

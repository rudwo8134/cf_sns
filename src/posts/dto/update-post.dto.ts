import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/vailidation-message/string-validation.message';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsString({
    message: stringValidationMessage,
  })
  @MinLength(1, {
    message: 'title must be at least 1 character long, please try again',
  })
  title?: string;

  @IsOptional()
  @IsString({
    message: stringValidationMessage,
  })
  @MinLength(1, {
    message: 'content must be at least 1 character long, please try again',
  })
  content?: string;
}

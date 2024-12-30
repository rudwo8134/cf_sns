import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/vailidation-message/length-validation.message';
import { emailValidationMessage } from 'src/common/vailidation-message/email-validation.message';
import { stringValidationMessage } from 'src/common/vailidation-message/string-validation.message';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
    length: 20,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column({})
  @IsString({
    message: stringValidationMessage,
  })
  @Length(8, 20, {
    message: lengthValidationMessage,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}

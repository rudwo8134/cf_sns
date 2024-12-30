import { IsString, MinLength } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/vailidation-message/string-validation.message';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsNotEmpty({
    message: 'title is required, please try again',
  })
  @IsString({
    message: stringValidationMessage,
  })
  @MinLength(1, {
    message: 'title must be at least 1 character long, please try again',
  })
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString({
    message: stringValidationMessage,
  })
  @MinLength(1, {
    message: 'content must be at least 1 character long, please try again',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}

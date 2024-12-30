import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) Get Posts
  // 모든 post를 가져온다
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }
  //#dd

  // 2) Get Post by ID
  // id를 통해 post를 가져온다
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) Create Post
  // post를 생성한다
  @Post()
  @UseGuards(AccessTokenGuard)
  createPost(@Body() body: CreatePostDto, @User('id') userId: number) {
    return this.postsService.createPost(userId, body);
  }

  // 4) Update Post
  // post를 업데이트한다
  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // 5) Delete Post :id
  // post를 삭제한다
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}

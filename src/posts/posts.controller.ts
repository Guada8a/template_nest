import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { postSchema } from 'src/schemas/post.schema';
import { ApiBody } from '@nestjs/swagger';
import { ApiCustomResponses } from 'src/decorators/customResponses.decorator';
import { ResponseUtil } from 'src/utils/response.util';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiCustomResponses({ summary: 'Create a new post', successExample: postSchema })
  @ApiBody({ schema: { ...postSchema, required: ['title', 'content', 'authorId'] } })
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    const createdPost = await this.postsService.createPost(post);
    return ResponseUtil.success('Post created successfully', createdPost);
  }

  @ApiCustomResponses({ summary: 'Get all posts', successExample: postSchema })
  @Get()
  async getPosts() {
    return ResponseUtil.success('Posts retrieved successfully', await this.postsService.getPosts());
  }

  @ApiCustomResponses({ summary: 'Get post by ID', successExample: postSchema })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.getPostById(id);
    //Send empty object if post not found
    if (!post) {
      return ResponseUtil.success('Post not found', {});
    }
    return ResponseUtil.success('Post retrieved successfully', post);
  }
}


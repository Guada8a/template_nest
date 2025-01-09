import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private usersService: UsersService
  ) { }

  async createPost(post: CreatePostDto) {
    const user = await this.usersService.getUser(post.authorId);
    if (!user) {
      return null;
    }

    const newPost = this.postRepository.create({
      ...post,
      author: user,
    });
    return await this.postRepository.save(newPost);
  }

  async getPosts() {
    return await this.postRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    return post;
  }
}

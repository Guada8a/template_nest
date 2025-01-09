import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (userFound) {
      return null;
    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);

  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUser(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return null;
    }
    const updatedUser = { ...userFound, ...updateUserDto };
    return await this.userRepository.save(updatedUser);
  }

  async getUserByUsername(username: string) {
    const userFound = await this.userRepository.findOne({ where: { username } });
    if (!userFound) {
      return null;
    }
    return userFound;
  }

  async removeUser(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return null;
    }
    return await this.userRepository.delete(id);
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return null;
    }
    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;

    return await this.userRepository.save(userFound);
  }

  async getProfileComplete(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
    if (!user) {
      return null;
    }
    return user;
  }

  async getPosts(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['posts'] });
    if (!user) {
      return null;
    }
    return user.posts;
  }
}
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private users = [];
  private userNotifications = {};

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    await this.rabbitMQService.consume('user_notifications', (message) => {
      const { userId, message: msgContent } = message;
      if (!this.userNotifications[userId]) {
        this.userNotifications[userId] = [];
      }
      this.userNotifications[userId].push(msgContent);
      console.log(`Received message for user ${userId}: ${msgContent}`);
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = { id: this.users.length + 1, ...createUserDto };
    this.users.push(newUser);

    // Envoyer un message de notification à RabbitMQ
    const message = { userId: newUser.id, message: `User ${newUser.username} with email ${newUser.email} created.` };
    await this.rabbitMQService.sendMessage('notification.user', message);

    return newUser;
  }

  async getAllUsers() {
    return this.users;
  }

  async getUserById(id: number) {
    return this.users.find(user => user.id === id);
  }

  async getUserNotifications(userId: number) {
    return this.userNotifications[userId] || [];
  }
}

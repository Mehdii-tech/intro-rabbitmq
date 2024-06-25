import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendNotification(notificationDto: NotificationDto) {
    const routingKey = 'notification.' + notificationDto.userId;
    await this.rabbitMQService.sendMessage(routingKey, notificationDto);
  }
  async receiveNotification(userId: string) {
    return await this.rabbitMQService.consume('user_notifications', (message) => {
      if (message.userId === userId) {
        console.log(`Received notification for user ${userId}: ${message.message}`);
      }
    });
  }
}

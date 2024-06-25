import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Get('receive/:userId')
  async receiveNotification(@Param('userId') userId: string) {
    const notifications = await this.notificationsService.receiveNotification(userId);
    return `Received notifications: ${JSON.stringify(notifications)}`;
  }
  @Post('send')
  async sendNotification(@Body() notificationDto: NotificationDto) {
    await this.notificationsService.sendNotification(notificationDto);
    return 'Notification sent to RabbitMQ';
  }


}

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';

const RABBITMQ_URL = "amqp://guest:guest@localhost:5672";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange('notifications_exchange', 'topic', { durable: true });
      await this.channel.assertQueue('user_notifications', { durable: true });
      await this.channel.bindQueue('user_notifications', 'notifications_exchange', 'notification.user');
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async sendMessage(routingKey: string, message: any) {
    try {
      const notification = JSON.stringify(message);
      this.channel.publish('notifications_exchange', routingKey, Buffer.from(notification), { persistent: true });
    } catch (error) {
      this.logger.error('Failed to send message', error);
    }
  }

  async consume(queue: string, onMessage: (msg: any) => void) {
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        this.channel.ack(msg);
        onMessage(JSON.parse(msg.content.toString()));
      }
    });
  }
}

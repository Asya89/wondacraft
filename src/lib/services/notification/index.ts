export interface OrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: Array<{ productName: string; quantity: number; totalPrice: number }>;
  totalAmount: number;
}

export interface NotificationService {
  sendNewOrderNotification(payload: OrderNotificationPayload): Promise<void>;
}

class NoOpNotificationService implements NotificationService {
  async sendNewOrderNotification(_payload: OrderNotificationPayload): Promise<void> {
    // Telegram/email notifications can be wired here later
    if (process.env.NODE_ENV === 'development') {
      console.info('[Notification] New order notification skipped (not configured)');
    }
  }
}

let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    notificationService = new NoOpNotificationService();
  }
  return notificationService;
}

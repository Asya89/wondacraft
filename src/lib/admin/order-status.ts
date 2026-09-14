import { OrderStatus } from '@prisma/client';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Սպասում է հաստատման',
  CONFIRMED: 'Հաստատված է',
  PROCESSING: 'Պատրաստվում է',
  COMPLETED: 'Ավարտված է',
  CANCELLED: 'Չեղարկված է',
};

export const ORDER_STATUS_HELP: Record<OrderStatus, string> = {
  PENDING: 'Գնորդը պատվեր է ուղարկել, դու դեռ չես հաստատել։',
  CONFIRMED: 'Դու կապվել ես գնորդի հետ և պատվերը հաստատել եք։',
  PROCESSING: 'Պատվերը պատրաստվում/փաթեթավորվում է։',
  COMPLETED: 'Պատվերը գնորդին հասել է։',
  CANCELLED: 'Պատվերը չեղարկվել է։',
};

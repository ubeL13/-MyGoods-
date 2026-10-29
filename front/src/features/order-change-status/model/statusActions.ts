import type { TOrderStatus } from '@/entities/order'

export type TStatusAction = {
  status: TOrderStatus
  buttonText: string
  confirmTitle: string
  confirmDescription: string
  successMessage: string
}

export const NEXT_STATUS_ACTION: Partial<Record<TOrderStatus, TStatusAction>> =
  {
    New: {
      status: 'Confirmed',
      buttonText: 'Подтвердить',
      confirmTitle: 'Подтвердить заказ?',
      confirmDescription: 'Заказ перейдёт в работу на склад.',
      successMessage: 'Заказ подтверждён',
    },
    Confirmed: {
      status: 'Assembled',
      buttonText: 'Отметить собранным',
      confirmTitle: 'Заказ собран?',
      confirmDescription: 'Все позиции укомплектованы и готовы к отправке.',
      successMessage: 'Заказ собран',
    },
    Assembled: {
      status: 'Shipped',
      buttonText: 'Отправить',
      confirmTitle: 'Отправить заказ?',
      confirmDescription:
        'Товары будут списаны со склада. Отменить отправку будет нельзя.',
      successMessage: 'Заказ отправлен, остатки списаны',
    },
    Shipped: {
      status: 'Delivered',
      buttonText: 'Доставлен',
      confirmTitle: 'Отметить заказ доставленным?',
      confirmDescription: 'Покупатель получил заказ, заказ будет закрыт.',
      successMessage: 'Заказ доставлен',
    },
  }

export const CANCELLABLE_STATUSES: TOrderStatus[] = [
  'New',
  'Confirmed',
  'Assembled',
]

export const CANCEL_ACTION: TStatusAction = {
  status: 'Cancelled',
  buttonText: 'Отменить заказ',
  confirmTitle: 'Отменить заказ?',
  confirmDescription:
    'Резерв товаров будет снят. Вернуть заказ в работу будет нельзя.',
  successMessage: 'Заказ отменён',
}

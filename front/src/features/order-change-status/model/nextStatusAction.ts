import type { TOrderStatus } from '@/entities/order'

export type TNextStatusAction = {
  status: TOrderStatus
  buttonText: string
  confirmTitle: string
  confirmDescription: string
  successMessage: string
}

export const NEXT_STATUS_ACTION: Partial<
  Record<TOrderStatus, TNextStatusAction>
> = {
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
}

'use client'

import { useMercadoPago } from '@/hooks/useMercadoPago'
import { useStripe } from "@/hooks/useStripe"

export default function Pagamentos() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe()
  const { createMercadoPagoCheckout } = useMercadoPago()

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-4xl font-bold mb-10'>Pagamentos</h1>
      <button
        type='button'
        className='border rounded-md px-1'
        onClick={() => createPaymentStripeCheckout({
          testeId: 123
        })}
      >Criar Pagamento Stripe</button>
      <button
        type='button'
        className='border rounded-md px-1'
        onClick={() => createSubscriptionStripeCheckout({
          testeId: 123
        })}
      >Criar Assinatura Stripe</button>
      <button
        type='button'
        className='border rounded-md px-1'
        onClick={handleCreateStripePortal}
      >Criar Portal de Pagamento</button>
      <button
        type='button'
        className='border rounded-md px-1'
        onClick={() => createMercadoPagoCheckout({
          testeId: '123',
          userEmail: 'teste@teste.com'
        })}
      >Criar Pagamento Mercado Pago</button>
    </div>
  )
}
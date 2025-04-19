import type { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
	const { user_email, teste_id } = paymentData.metadata

	console.log('Pagamento com sucesso', paymentData)
}

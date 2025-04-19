import { resend } from '@/lib/resend'
import type { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
	const { user_email: userEmail, teste_id } = paymentData.metadata

	console.log('Pagamento com sucesso', paymentData)

	const { data, error } = await resend.emails.send({
		from: 'Acme <brunohenriquesantos272@gmail.com>',
		to: [userEmail],
		subject: 'Assinatura Template Saas',
		text: 'Pagamento realizado com sucesso',
	})

	if (error) {
		console.error(error)
	}

	console.log(data)
}

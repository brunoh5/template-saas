import { EmailTemplate } from '@/components/email-template'
import { db } from '@/lib/firebase'
import { resend } from '@/lib/resend'
import 'server-only'

import type Stripe from 'stripe'

export async function handleStripePayment(
	event: Stripe.CheckoutSessionCompletedEvent
) {
	if (event.data.object.payment_status === 'paid') {
		console.log(
			'Pagamento realizado com sucesso. Enviar um email liberar acesso'
		)

		const metadata = event.data.object.metadata

		const userId = metadata?.userId
		const userEmail = metadata?.userEmail

		if (!userId || !userEmail) {
			console.log('User ID not found')
			return
		}

		await db.collection('users').doc(userId).update({
			stripeSubscriptionId: event.data.object.subscription,
			subscriptionStatus: 'active',
		})

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
}

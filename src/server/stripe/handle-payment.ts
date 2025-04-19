import { db } from '@/lib/firebase';
import 'server-only'

import type Stripe from 'stripe';

export async function handleStripePayment({ data }: Stripe.CheckoutSessionCompletedEvent) {
	if (data.object.payment_status === 'paid') {
		console.log('Pagamento realizado com sucesso. Enviar um email liberar acesso');

		const metadata = data.object.metadata

		const userId = metadata?.userId

		if (!userId) {
			console.log('User ID not found')
			return
		}

		await db.collection('users').doc(userId).update({
			stripeSubscriptionId: data.object.subscription,
			subscriptionStatus: 'active',
		})
	}
}

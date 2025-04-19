import { db } from '@/lib/firebase'
import 'server-only'

import type Stripe from 'stripe'

export async function handleStripeCancelSubscription({
	data,
}: Stripe.CustomerSubscriptionDeletedEvent) {
	console.log('Cancelou a assinatura')

	const customerId = data.object.customer
	const userRef = await db
		.collection('users')
		.where('stripeCustomerId', '==', customerId)
		.get()

	if (userRef.empty) {
		console.error('User not found')
		return
	}

	const userId = userRef.docs[0].id

	await db.collection('users').doc(userId).update({
		subscriptionStatus: 'inactive',
	})
}

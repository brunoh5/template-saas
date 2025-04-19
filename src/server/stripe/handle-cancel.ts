import { db } from '@/lib/firebase'
import { resend } from '@/lib/resend'
import 'server-only'

import type Stripe from 'stripe'

export async function handleStripeCancelSubscription(
	event: Stripe.CustomerSubscriptionDeletedEvent
) {
	console.log('Cancelou a assinatura')

	const customerId = event.data.object.customer
	const userRef = await db
		.collection('users')
		.where('stripeCustomerId', '==', customerId)
		.get()

	if (userRef.empty) {
		console.error('User not found')
		return
	}

	const userId = userRef.docs[0].id
	const userEmail = userRef.docs[0].data().email

	await db.collection('users').doc(userId).update({
		subscriptionStatus: 'inactive',
	})

	const { data, error } = await resend.emails.send({
		from: 'Acme <brunohenriquesantos272@gmail.com>',
		to: [userEmail],
		subject: 'Assinatura Template Saas',
		text: 'Assinatura cancelada com sucesso',
	})

	if (error) {
		console.error(error)
	}

	console.log(data)
}

import stripe from '@/lib/stripe'
import { handleStripeCancelSubscription } from '@/server/stripe/handle-cancel'
import { handleStripePayment } from '@/server/stripe/handle-payment'
import { handleStripeSubscription } from '@/server/stripe/handle-subscription'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

const secret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
	try {
		const body = await req.text()
		const headersList = await headers()
		const signature = headersList.get('stripe-signature')

		if (!secret) {
			return NextResponse.json(
				{ error: 'No secret was provided' },
				{ status: 500 }
			)
		}

		if (!signature) {
			return NextResponse.json(
				{ error: 'No signature or secret' },
				{ status: 400 }
			)
		}

		const event = stripe.webhooks.constructEvent(body, signature, secret)

		switch (event.type) {
			case 'checkout.session.completed': {
				// Pagamento Realizado se status = paid - Pode ser tanto pagamento unico quanto assinatura
				const metadata = event.data.object.metadata

				if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
					await handleStripePayment(event)
				}

				if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
					await handleStripeSubscription(event)
				}
				break
			}
			case 'checkout.session.expired': // Expirou o tempo de pagamento
				console.log(
					'Enviar um email para o usuario avisando que o pagamento expirou'
				)
				break
			case 'checkout.session.async_payment_succeeded': // Boleto Pago
				console.log(
					'Enviar um email para o usuario avisando que o pagamento foi realizado'
				)
				break
			case 'checkout.session.async_payment_failed': // Boleto Falhou
				console.log(
					'Enviar um email para o usuario avisando que o pagamento expirou'
				)
				break
			case 'customer.subscription.created': // Criou a assinatura
				console.log(
					'Mensagem de boas vindas para o cliente que acabou de assinar'
				)
				break
			case 'customer.subscription.deleted': // Cancelou a assinatura
				await handleStripeCancelSubscription(event)
				break
			default:
				console.log(`Unhandle event type ${event.type}`)
		}

		return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

import { mpClient } from '@/lib/mercado-pago'
import { Preference } from 'mercadopago'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { testeId, userEmail } = await req.json()

	try {
		const preference = new Preference(mpClient)

		const createdPreference = await preference.create({
			body: {
				// external_reference impacta na pontuação do Mercado Pago
				external_reference: testeId,
				metadata: {
					// Essa variavel é convertida para snake_case -> teste_id,
					testeId,
				},
				// Também é importante para a pontuação - quanto mais informação é melhor
				...(userEmail && { payer: { email: userEmail } }),
				items: [
					{
						id: '',
						description: '',
						title: '',
						quantity: 1,
						unit_price: 1,
						currency_id: 'BRL',
						category_id: 'services',
					},
				],
				payment_methods: {
					installments: 12,
					excluded_payment_methods: [{ id: 'bolbradesco' }, { id: 'pec' }],
					// excluded_payment_types: [{ id: 'debit_card' }, { id: 'credit_card' }],
				},
				auto_return: 'approved',
				back_urls: {
					success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
					failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
					pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
				},
			},
		})

		if (!createdPreference.id) {
			return NextResponse.json(
				{ error: 'Erro ao criar checkout com Mercado Pago' },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			preferenceId: createdPreference.id,
			// biome-ignore lint/style/useNamingConvention: nome vem do mercado-pago
			init_point: createdPreference.init_point,
		})
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{ error: 'Erro ao criar checkout com Mercado Pago' },
			{ status: 500 }
		)
	}
}

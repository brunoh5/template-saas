import Stripe from 'stripe'
// biome-ignore lint/style/noNonNullAssertion: environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil"
})

export default stripe
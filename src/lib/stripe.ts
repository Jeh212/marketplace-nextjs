import Stripe from 'stripe';


const stripeApi = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
    appInfo: {
        name: 'ignite-shop'
    }
})
export { stripeApi }
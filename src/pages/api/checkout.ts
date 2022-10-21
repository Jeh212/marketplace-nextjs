import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripeApi } from "../../lib/stripe";


//Api root podem ser executada pelo lado do servidor NODE



export default async function checkoutHandler(req: NextApiRequest, res: NextApiResponse) {
    const { priceId } = req.body


    if (req.method !== 'POST') {
        return res.status(405).json('Method not allowed')
    }

    if (!priceId) {
        return res.status(400).json({ error: 'Price not found.' })
    }

    const success = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
    const canceled = `${process.env.NEXT_URL}/cancel`

    const checkoutSession = await stripeApi.checkout.sessions.create({
        success_url: success,
        cancel_url: canceled,
        mode: 'payment',
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ]
    })

    return res.status(201).json({
        checkoutUrl: checkoutSession.url,
    })
}

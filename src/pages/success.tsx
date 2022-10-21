import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/future/image"
import Head from "next/head";

import Stripe from "stripe";
import { stripeApi } from "../lib/stripe";
import { ImageContainer, SuccessContainer } from "../styles/pages/Sucess";
interface SuccessProps {
    customerName: string;
    product: {
        name: string;
        imageUrl: string;
    }


}

export default function Success({ product, customerName }: SuccessProps) {


    return (
        <>
            <Head>
                <title>Compra efetuada | Ignite Shop</title>
                <meta name="robots" content="noindex" />
            </Head>

            <SuccessContainer>
                <h1>Compra Efetuada</h1>
                <ImageContainer>
                    <Image src={product.imageUrl} width={120} height={110} alt="" />
                </ImageContainer>

                <p>
                    Uhuul <strong>{customerName},</strong> sua <strong>{product.name}</strong>  já está a caminho da sua casa.
                </p>

                <Link href="">
                    Voltar ao catálogo
                </Link>
            </SuccessContainer>


        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    if (!query.session_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const sessionId = String(query.session_id)


    //Faz o checkout na api do stripe
    const session = await stripeApi.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product'],
    });

    const customerName = session.customer_details.name;
    const product = session.line_items.data[0].price.product as Stripe.Product


    return {
        props: {
            customerName,
            product: {
                name: product.name,
                imageUrl: product.images[0]
            }
        }
    }
}

//METODOS DE Fetch no NEXT 
// Client-Side (useEffect()) | 
// getServerSideProps (Carrega toda vez que a pagina inicia de forma assincrona) | 
// getStaticProps(Carrega somente a pagina que não existe de modo estatico)
/* eslint-disable react/jsx-no-undef */
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from 'next/future/image'
import Stripe from "stripe";
import { stripeApi } from "../../Api/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/products";
import ReactLoading from "react-loading";



interface Product {
    id: string;
    name: string;
    imageUrl: string
    price: string
    description: string
}

interface ProductProps {
    product: Product
}

export default function Product({ product }: ProductProps) {

    // O fallback estiver como true, ele vai executar o metodo getStaticProps
    // busca os dados de forma assincrona. Enquanto os novos dados não são carregados,
    // é passado é possivel passar uma tela de loading isFallback do hook useRouter()

    const { isFallback } = useRouter();

    if (isFallback) {
        return (
            <ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50} />
        )
    }


    return (
        <ProductContainer>

            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={480} alt="" />
            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>
                <p>{product.description}</p>
                <button>Comprar Agora</button>
            </ProductDetails>

        </ProductContainer>



    )
}

//Sempre que ter uma pagina ESTÁTICA que recebe um paramentro, precisa retornar 
// um getStaticPaths que é um metodo que retornar os dados do paramentro e gera uma pagina ESTÁTICA
// para o produto

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { id: 'prod_Meh7l9iYsbRw6T' }
            }
        ],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = params['id'];

    const product = await stripeApi.products.retrieve(productId, {
        expand: ['default_price']
    });

    const price = product.default_price as Stripe.Price;

    const formatedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price.unit_amount / 100)


    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: formatedPrice,
                description: product.description
            }
        },
        revalidate: 60 * 60 * 1
    }
}
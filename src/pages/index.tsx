import Image from "next/future/image"
import { stripeApi } from "../Api/stripe"
import Link from 'next/link'

import { styled } from "../styles"
import { HomeContainer, Product } from "../styles/pages/home"
import camiseta2 from '../assets/2.png'
import camiseta3 from '../assets/3.png'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { GetStaticProps } from "next"
import Stripe from "stripe"


interface Product {
    id: string;
    name: string;
    imageUrl: string
    price: string
}

interface HomeProps {
    products: Product[]
}

export default function Home({ products }: HomeProps) {
    const [sliderRefe] = useKeenSlider({
        slides: {
            perView: 3,
            spacing: 48
        }
    })



    return (

        <HomeContainer ref={sliderRefe} className="keen-slider">
            {
                products.map(product => {
                    return (
                        <Link href={`/product/${product.id}`} key={product.id}>
                            <Product className="keen-slider__slide">
                                <Image src={product.imageUrl} alt={""} width={520} height={400} />

                                <footer>
                                    <strong>{product.name}</strong>
                                    <span>{product.price}</span>
                                </footer>
                            </Product>
                        </Link>
                    )
                })
            }
        </HomeContainer>
    )
}

// eslint-disable-next-line @next/next/no-typos
export const getStaticProps: GetStaticProps = async () => {

    const response = await stripeApi.products.list({
        expand: ['data.default_price']
    });

    const products = response.data.map(({ id, name, images, default_price }) => {
        const { unit_amount } = default_price as Stripe.Price

        const formatedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(unit_amount / 100)


        return {
            id,
            name,
            imageUrl: images[0],
            price: formatedPrice
        }
    })

    return {
        props: { products },

        revalidate: 60 * 60 * 2 //2 horas,
    }

}
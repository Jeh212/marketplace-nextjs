import Image from 'next/future/image';
import { globalStyles } from "../styles/global"
import Logo from '../assets/Logo.svg'
import { Container, Header } from "../styles/pages/app"
globalStyles()

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Header>
        <Image src={Logo} alt="Logo" />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp


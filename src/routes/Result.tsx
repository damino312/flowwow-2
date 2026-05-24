import { Container } from "../components/Container"
import Layout from "../components/Layout"

const Result = () => {
  return (
    <Layout className="result-layout">
      <Container>
        <div className="result">
        <p className="name">{sessionStorage.getItem('formName')}</p>
        <div className="text">
          <p>А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.</p>
          <p>Не спорь со звездами. Сделай красиво. Вот промокод.</p>
        </div>
        <div className="gift"><img src="src/assets/gift-3.svg" alt="gift"/><p>LUNAR</p></div>
        <p className='share'>Скринь, шерь, жди пионы</p>
        </div>
      </Container>
    </Layout>
  )
}

export default Result
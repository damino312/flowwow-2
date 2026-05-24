import { type FC } from 'react'
import { Container } from '../components/Container'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Home: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/prediction')
  }

  return (
    <Layout className='home-bg'>
      <div className='home'>
      <Container>
        <div className='logo2'>
          <img src='src/assets/logo-2.svg' alt="logo" />
        </div>
        <h2>Пионовый предсказатель</h2>
        <p className='home-text'>Узнай, когда он подарит тебе пионы,<br />и мягко намекни</p>
        <Button type="button" color='primary' onClick={handleClick}>Предсказать</Button>
      </Container>
      <div className='peonie'>
        <img src='src/assets/peonie_1.png' alt="peonie" className='home-img' />
        <img src='src/assets/peonie_3.png' alt="peonie" className='home-img' />
        <img src='src/assets/star.png' alt="peonie" className='home-img' />
      </div>
        </div>
    </Layout>
  )
}

export default Home
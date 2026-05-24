import { type FC } from 'react'
import Layout from '../components/Layout'
import ProgressBar from '../components/ProgressBar'

type TLoadingProps = {
    progress?: number
}

const Loading:FC<TLoadingProps> = () => {
  return (
    <Layout>
        <div className='loading'>
            <img src='src/assets/gift.png' alt='gift' />
            <p>Анализируем положение цветочных планет,
            делаем выгрузку заказов за 5 лет</p>
            <ProgressBar/>
        </div>
    </Layout>
  )
}

export default Loading
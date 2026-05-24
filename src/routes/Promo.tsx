import Layout from '../components/Layout'
import { Container } from '../components/Container'
import Button from '../components/Button'
import { useEffect, useState, type FC } from 'react'
import { monthPrediction } from '../const/copyrights'
import { useNavigate } from 'react-router-dom'

const Promo: FC = () => {
  const navigate = useNavigate()

  const [date, setDate] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, setName] = useState<string>('')

  useEffect(() => {
    if (!sessionStorage.getItem('formDate')) {
      sessionStorage.setItem('formDate', '25.11.1995')
    }

    if (!sessionStorage.getItem('formName')) {
      sessionStorage.setItem('formName', 'Никита')
    }
    setName(sessionStorage.getItem('formName') || '')
    setDate(sessionStorage.getItem('formDate') || '')
  }, [])

  const month = date.split('.')[1];


  return (
    <Layout>
      <div className='promo'>
      <div className='code'>
          <p className='promotext'>Твой промокод:</p>
          <p className='promocode'>LUNAR</p>
      </div>
      <Container>
        <div>
        <div className='gift'>
          <img src="src/assets/gift-2.svg" alt='gift' />
        </div>
        <p className='date'>{monthPrediction(month)?.date}</p>
        <p className='text'>{monthPrediction(month)?.text}</p>
        <p className='text'>{monthPrediction(month)?.promocodeText}</p>
        </div>
        <Button color='primary' type={'button'} onClick={() => {navigate('/result')}}>Намекнем ему?</Button>
      </Container>
      </div>
    </Layout>
  )
}

export default Promo
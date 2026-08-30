import styled from 'styled-components'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { Code } from 'react-feather'

import Button from '@/@core/components/button'
import { LOGIN } from '@/utils/constants'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'ahooks'

const Container = styled.div`
  margin-top: 20px;
  padding: 30px 20px 10px 20px;
  border: 1px solid #e1e0e0;
  background-color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  border-radius: 5px;
  text-align: center;

  .dark-layout & {
    background-color: #283046;
    border: 1px solid #161d31;
  }
`

const Img = styled.img`
  margin-top: 2rem;
  border: 1px solid #f5f5f5;

  .dark-layout & {
    background-color: #283046;
    border: 1px solid #161d31;
  }
`

const QrCode = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const { t } = useTranslation()
  useTitle('QrCode | SchoolManager')

  return (
    <Container className="flex flex-col items-center mx-auto w-full md:w-6/12 lg:w-4/12">
      <Code size={32} />
      <div className="text-3xl font-bold">
        Scanner le QrCode avec Microsoft authenticator
      </div>
      <Img src={location.state.imageUrl} alt="image to scan" />

      <Button
        onClick={() => navigate({ to: LOGIN })}
        className="round mt-4"
        color="primary"
      >
        {t('label-gotoLogin')}
      </Button>
    </Container>
  )
}

export default QrCode

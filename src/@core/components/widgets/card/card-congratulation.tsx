// ** Icons Imports
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@/@core/components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'

// ** Images
import decorationLeft from '@/assets/images/elements/decore-left.png'
import decorationRight from '@/assets/images/elements/decore-right.png'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'

interface Props {
  onClick?: () => void
}

const CardCongratulations: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  const { username } = useAuthentication()

  return (
    <Card
      className="card-congratulations cursor-pointer rounded-sm"
      onClick={onClick}
    >
      <CardBody className="text-center">
        <img
          className="congratulations-img-left"
          src={decorationLeft}
          alt="decor-left"
        />
        <img
          className="congratulations-img-right"
          src={decorationRight}
          alt="decor-right"
        />
        <Avatar
          icon={<Award size={28} />}
          className="shadow"
          color="primary"
          size="xl"
        />
        <div className="text-center">
          <h1 className="mb-1 text-white font-thin">
            <strong>{username}</strong>, {t('label-welcome')}{' '}
          </h1>
          <CardText className="m-auto w-75 text-md font-medium">
            {t('label-startGuideText')}
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCongratulations

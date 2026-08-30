import Button from '@/@core/components/button'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'

interface Props {
  loading: boolean
}

const WizardButtons: React.FC<Props> = ({ loading }) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-between mt-1">
      <Button color="secondary" className="btn-prev flex" outline disabled>
        <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
        <span className="align-middle d-sm-inline-block d-none">
          {t('label-previous')}
        </span>
      </Button>
      <Button
        type="submit"
        color="primary"
        className="btn-next flex"
        loading={loading}
      >
        <span className="align-middle d-sm-inline-block d-none">
          {t('label-next')}
        </span>
        <ArrowRight
          size={14}
          className="align-middle ms-sm-25 ms-0"
        ></ArrowRight>
      </Button>
    </div>
  )
}

export default WizardButtons

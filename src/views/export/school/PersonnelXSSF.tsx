import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import { BASE_REPORT_URL } from '@/utils/constants'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Field {
  name: string
  label: string
}

const PersonnelXSSF = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const fields = useMemo<Field[]>(
    () => [
      { name: 'fullName', label: t('label-fullName') },
      { name: 'registrationNumber', label: t('label-registrationNumber') },
    ],
    [t],
  )

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-personnelReport')} />
      </div>

      {fields.map((field, index) => (
        <span key={index}>{field.label}</span>
      ))}
      <a
        className="btn btn-primary"
        href={`${BASE_REPORT_URL}/reports/personnel-list-excel-${enterpriseId}.xlsx`}
      >
        {t('label-download')}
      </a>
    </div>
  )
}

export default PersonnelXSSF

import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface FormTitleProps {
  title: string
  subtitle?: string
}

const FormTitle: FC<FormTitleProps> = ({ title, subtitle }) => {
  const { t } = useTranslation()

  return (
    <>
      <h1 className="text-center mb-2 text-2xl md:text-3xl font-medium">
        {t(title)}
      </h1>
      <p className="text-center">{subtitle ? t(subtitle) : ''}</p>
    </>
  )
}

export default FormTitle

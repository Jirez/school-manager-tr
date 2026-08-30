import { useTranslation } from 'react-i18next'
import { FileText, Key, Shield } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import LicenseForm from './LicenseForm'
import LicenseTextForm from './LicenseTextForm'

const LicenseWrapper = (props: any) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {t('label-licenseText')}
            </h2>
            <p className="text-indigo-100 text-xs">
              {t('label-licenseTextDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-1">
        {/* License Text Input */}
        <div className="xl:col-span-6">
          <FormSection
            icon={<Key />}
            title={t('label-licenseText')}
            description={t('label-pasteLicense')}
            color="#6366f1"
            className="h-full"
          >
            <LicenseTextForm {...props} />
          </FormSection>
        </div>

        {/* License File Upload */}
        <div className="xl:col-span-6">
          <FormSection
            icon={<FileText />}
            title={t('label-licenseFile')}
            description={t('label-licenseFileDescription')}
            color="#10b981"
            className="h-full"
          >
            <LicenseForm {...props} />
          </FormSection>
        </div>
      </div>
    </div>
  )
}

export default LicenseWrapper

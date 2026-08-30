import { useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Activity, User } from 'lucide-react'
import { Input as BaseInput } from 'reactstrap'

import FileUpload from '@/@core/components/ui/forms/file-upload'
import WebcamImage from '@/@core/components/image/webcam-image'
import ImagePreview from '@/@core/components/image/image-preview'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import RestDataSource from '@/utils/RestDataSource'
import { TOAST_OPTIONS } from '@/utils/constants'

interface PictureManagerProps {
  picture?: string | null
  onPictureChange: (picture: string | null) => void
  title?: string
  description?: string
  className?: string
  hFull?: boolean
}

const config = await fetch('/configuration.json').then((res) => res.json())

const PictureManager: FC<PictureManagerProps> = ({
  picture,
  onPictureChange,
  title,
  description,
  className = '',
  hFull = true,
}) => {
  const { t } = useTranslation()
  const [webcamActive, setWebcamActive] = useState(false)

  const handleFileUpload = (file: File) => {
    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', 'Picture Upload')
    formData.append('details', 'details')
    formData.append('picturePath', config?.uploadDir || 'C:/Temp/')

    dataSource
      .upload(`upload/file`, formData, (datum: any) => {
        toast.success(
          t('label-uploadSuccess') || 'Importation terminée avec succès',
          { ...TOAST_OPTIONS },
        )
        if (datum) {
          onPictureChange(datum.fileName)
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message)
      })
  }

  const handleWebcamUpload = (webcamData: any) => {
    const dataSource = new RestDataSource()
    const formData = new FormData()
    const data = webcamData.toString().replace(/^data:image\/jpeg;base64,/, '')
    formData.append('imageValue', data)
    formData.append('picturePath', config?.uploadDir || 'C:/Temp/')

    dataSource
      .upload(`upload/webcam`, formData, (datum: any) => {
        toast.success(
          t('label-webcamSaveSuccess') || 'Image sauvegardée avec succès',
          { ...TOAST_OPTIONS },
        )
        if (datum) {
          onPictureChange(datum)
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message)
      })
  }

  return (
    <FormSection
      title={title || t('label-photo') || 'Photo'}
      description={description || t('label-photoDesc') || 'Identité visuelle'}
      icon={<User size={18} />}
      color="#28c76f"
      className={`${className} ${hFull ? 'h-full' : ''}`}
    >
      <div className="flex flex-col gap-1">
        {!picture && !webcamActive && (
          <FileUpload
            accept="image/*"
            onChange={(data: any) => {
              if (data && data.length > 0) {
                handleFileUpload(data[0])
              }
            }}
          />
        )}

        {!picture && webcamActive && (
          <WebcamImage onShot={handleWebcamUpload} />
        )}

        {picture && (
          <ImagePreview
            url={picture}
            deleteAction={() => {
              onPictureChange(null)
              setWebcamActive(false)
            }}
          />
        )}

        {!picture && (
          <ToggleOption
            icon={<Activity size={14} />}
            title={t('label-useWebcam')}
            description={t('label-webcamDesc') || 'Capturer via caméra'}
            isActive={webcamActive}
          >
            <BaseInput
              type="switch"
              checked={webcamActive}
              onChange={(e) => setWebcamActive(e.target.checked)}
            />
          </ToggleOption>
        )}
      </div>
    </FormSection>
  )
}

export default PictureManager

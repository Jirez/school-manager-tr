import { useState } from 'react'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
// import { useTranslation } from 'react-i18next';
import type { NiceModalHandler } from '@ebay/nice-modal-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import RestDataSource from '@/utils/RestDataSource'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TOAST_OPTIONS } from '@/utils/constants'

interface ImportStudentFormProps {
  modal?: NiceModalHandler
}

const ImportGuardianForm: React.FC<ImportStudentFormProps> = ({ modal }) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  // const {t} = useTranslation();
  const { enterpriseId } = useAuthentication()

  const handleUpload = (event: React.FormEvent<any>, close?: boolean) => {
    event.preventDefault()
    event.stopPropagation()

    if (!values.file) {
      toast.error('Veuillez sélectionner le fichier à importer')
      return false
    }

    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', values.file)

    const callback = (data: any) => {
      toast.success('Importation terminée avec succès', { ...TOAST_OPTIONS })
      if (close) {
        modal?.hide()
      }
    }

    dataSource
      .upload(`import/guardian-${enterpriseId}`, formData, callback)
      .catch((error) => {
        // console.log(JSON.stringify(error));
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.message)
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
      })
  }

  return (
    <Form onSubmit={handleUpload}>
      <FileUpload
        accept="text/csv"
        onChange={(data: any) =>
          setValues((val) => ({ ...val, file: data[0] }))
        }
      />

      <ActionButtons
        cancelAction={() => modal?.hide()}
        isSubmitting={values.uploading}
        popover={false}
        dirty={false}
        onSubmit={handleUpload}
        fixed
      />
    </Form>
  )
}

export default ImportGuardianForm

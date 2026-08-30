import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import RestDataSource from '@/utils/RestDataSource'
import type { FC } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'

interface ImportTeacherFormProps {
  modal?: NiceModalHandler
}

const ImportTeacherForm: FC<ImportTeacherFormProps> = ({ modal }) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
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
      .upload(`import/teacher-${enterpriseId}`, formData, callback)
      .catch((error) => {
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

      {/* <div className="flex justify-end">
                <Button
                    color="primary"
                    onClick={handleUpload}
                    disabled={!values.file || !values.clazz}
                    loading={values.uploading}
                    style={{ marginTop: 16 }}
                >
                    {values.uploading ? 'Uploading' : 'Importer'}
                </Button>
            </div> */}
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

export default ImportTeacherForm

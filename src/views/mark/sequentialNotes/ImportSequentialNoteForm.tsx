import Button from '@/@core/components/button'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import RestDataSource from '@/utils/RestDataSource'
import { useState } from 'react'
import type { FC } from 'react'
import { toast } from 'react-toastify'
import { Card, Form } from 'reactstrap'

interface ImportSequentialNoteFormProps {
  classId?: number
  subjectId: number
  subPeriodId: number
}

const ImportSequentialNoteForm: FC<ImportSequentialNoteFormProps> = (props) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { enterpriseId } = useAuthentication()

  const handleUpload = () => {
    if (!props.classId) {
      toast.error('Veuillez sélectionner une classe')
      return false
    }

    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', values.file)

    const callback = (data: any) =>
      toast.success('Importation terminée avec succès', { ...TOAST_OPTIONS })

    dataSource
      .upload(
        `reports/import-sequential-notes-${props.classId}-${props.subjectId}-${props.subPeriodId}-${enterpriseId}`,
        formData,
        callback,
      )
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
      <Card className="p-2">
        <FileUpload
          accept="text/csv"
          onChange={(data: any) => setValues({ file: data[0] })}
        />

        <div className="flex justify-end">
          <Button
            color="primary"
            onClick={handleUpload}
            disabled={!values.file}
            loading={values.uploading}
            style={{ marginTop: 16 }}
          >
            {values.uploading ? 'Uploading' : 'Importer'}
          </Button>
        </div>
      </Card>
    </Form>
  )
}

export default ImportSequentialNoteForm

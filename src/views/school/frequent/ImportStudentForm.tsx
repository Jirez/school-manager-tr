import { useState } from 'react'
// import { useTranslation } from 'react-i18next';
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import RestDataSource from '@/utils/RestDataSource'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import Select from '@/@core/components/select'
import { classOptions } from '@/utils/select/selectComponents'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import Loader from '@/@core/components/spinner/loader'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { Form } from 'reactstrap'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useClassesQuery } from '@/gql/graphql'

interface ImportStudentFormProps {
  modal?: NiceModalHandler
  refetch: Function
}

const ImportStudentForm: React.FC<ImportStudentFormProps> = ({
  modal,
  refetch,
}) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  // const {t} = useTranslation();
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  if (loading) return <Loader />

  const handleUpload = (event: React.FormEvent<any>, close?: boolean) => {
    event.preventDefault()
    event.stopPropagation()

    const clazz = values.clazz ? values.clazz.id : null
    if (!clazz) {
      toast.error('Veuillez sélectionner une classe')
      return false
    }

    if (!values.file) {
      toast.error('Veuillez sélectionner le fichier à importer')
      return false
    }

    setValues((val) => ({ ...val, uploading: true }))
    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', values.file)

    const callback = (data: any) => {
      setValues((val) => ({ ...val, uploading: false }))
      toast.success('Importation terminée avec succès', { ...TOAST_OPTIONS })
      refetch()
      if (close) {
        modal?.hide()
      }
    }

    dataSource
      .upload(`import/student-${clazz}-${enterpriseId}`, formData, callback)
      .catch((error) => {
        setValues((val) => ({ ...val, uploading: false }))
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

  const handleSelectChange = (val: any) => {
    setValues({ ...values, clazz: val })
  }

  return (
    <Form onSubmit={handleUpload}>
      <div style={{ marginBottom: 20 }}>
        <Select
          value={values.clazz}
          onChange={handleSelectChange}
          options={data?.clazzes || undefined}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="Sélectionner une classe"
          components={{ Option: classOptions }}
        />
      </div>

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
        disabled={values.uploading}
      />
    </Form>
  )
}

export default ImportStudentForm

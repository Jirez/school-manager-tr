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
import { Form, Table } from 'reactstrap'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { useClassesQuery, useStudentImportMutation } from '@/gql/graphql'
import type { FrequentBulkImportType } from './Frequent.type'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SimpleInput from '@/@core/components/ui/simple-input'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'
import Button from '@/@core/components/button'
import dayjs from 'dayjs'
import { formatError } from '@/utils/ErrorHelper'

interface FormValues {
  items: FrequentBulkImportType[]
}

interface StudentImportProcessFormProps {
  modal?: NiceModalHandler
  refetch: Function
}

const StudentImportProcessForm: React.FC<StudentImportProcessFormProps> = ({
  modal,
  refetch,
}) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const [showUpload, setShowUpload] = useState(true)
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      items: [],
    },
  })

  const { fields, append } = useFieldArray({ control, name: 'items' })

  const { data, loading } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const [action, { loading: actionLoading }] = useStudentImportMutation()

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
      toast.success('Chargement terminé avec succès', { ...TOAST_OPTIONS })
      //refetch();

      setShowUpload(false)
      //console.log(data);
      data.forEach((item: any) => {
        append({
          studentId: item.studentId,
          lastName: item.lastName,
          firstName: item.firstName,
          birthDate: dayjs(item.birthDate).toDate(),
          birthplace: item.birthplace,
          registrationNumber: item.registrationNumber,
          gender: item.gender.charAt(0).toUpperCase(),
          repeater: item.repeater,
        })
      })
    }

    dataSource
      .upload(
        `import/load-student-${clazz}-${enterpriseId}`,
        formData,
        callback,
      )
      .catch((error) => {
        setValues((val) => ({ ...val, uploading: false }))
        //console.log(JSON.stringify(error));
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    //formatting items
    const items = data.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          studentId: item.studentId ? Number(item.studentId) : null,
          lastName: item.lastName,
          firstName: item.firstName,
          birthDate: dayjs(item.birthDate).format(INPUT_DATE_FORMAT),
          birthplace: item.birthplace,
          registrationNumber: item.registrationNumber,
          gender: item.gender === 'M' ? 'MALE' : 'FEMALE',
          repeater: item.repeater,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    //console.log(items);
    const clazz = values.clazz ? values.clazz.id : null

    if (!clazz) {
      toast.error('Veuillez sélectionner une classe')
      return false
    }

    action({
      variables: {
        students: items,
        schoolId: Number(enterpriseId),
        classId: values.clazz.id,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Import terminé avec succès`, {
          ...TOAST_OPTIONS,
        })
        refetch()
        modal?.hide()
      })
      .catch((error) => {
        toast.error(`Impossible d'importer le fichier : ${formatError(error)}`)
      })
  }

  const itemValid = (item: any) => {
    const {
      lastName,
      registrationNumber,
      birthDate,
      birthplace,
      gender,
      repeater,
    } = item
    return (
      lastName &&
      registrationNumber &&
      birthDate &&
      birthplace &&
      gender &&
      repeater
    )
  }

  return (
    <div>
      <Form onSubmit={handleUpload} className={showUpload ? '' : 'hidden'}>
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
          saveCloseLabel={t('label-import')}
          saveLabel={t('label-import')}
        />
      </Form>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={showUpload ? 'hidden' : ''}
      >
        <Table className="table table-bordered table-condensed table-hover responsive tableur tableFixHead">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '10%' }}>Id</th>
              <th style={{ width: '10%' }}>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>{t('label-lastName')}</th>
              <th style={{ width: '20%' }}>{t('label-firstName')}</th>
              <th>{t('label-birthDate')}</th>
              <th>{t('label-birthplace')}</th>
              <th>{t('label-gender')}</th>
              <th>{t('label-repeater')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.studentId`)}
                    //readOnly={watch(`items.${index}.studentId`) !== undefined}
                    readOnly={field.studentId !== null}
                    //type="number"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.registrationNumber`)}
                  />
                </td>
                <td>
                  <SimpleInput {...register(`items.${index}.lastName`)} />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.firstName`)} />
                </td>

                <td>
                  {/* <SimpleInput {...register(`items.${index}.birthDate`)} /> */}
                  <SimpleDatePicker
                    name={`items.${index}.birthDate`}
                    control={control}
                  />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.birthplace`)} />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.gender`)} />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.repeater`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-2 mb-2">
          <Button
            type="submit"
            loading={actionLoading}
            color="primary"
            className="round text-sm"
          >
            {t('label-save')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default StudentImportProcessForm

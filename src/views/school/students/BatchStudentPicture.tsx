import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, Input, Label, Table } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import Scrollbar from '@/@core/components/ui/scrollbar'
import {
  useLoadPicturesFromRegistrationNumbersLazyQuery,
  useStudentPicturesImportCancelMutation,
  useStudentPicturesSaveMutation,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { formatError } from '@/utils/ErrorHelper'
import { Image, Folder, UploadCloud, Info, AlertCircle } from 'react-feather'
import Button from '@/@core/components/button'
import { useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'
import SimpleInput from '@/@core/components/ui/simple-input'
import { TOAST_OPTIONS } from '@/utils/constants'

interface FormValues {
  items: {
    registrationNumber: string
    picture: string
    studentId: number
    lastName: string
    firstName: any
    gender: any
    birthDate: string
    birthplace: string
  }[]
}

const BatchStudentPicture = () => {
  const [path, setPath] = useState('')
  const [showUpload, setShowUpload] = useState(true)
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()
  useTitle(t('sidebar.students.batchPicture'))
  const baseImageUrl = 'https://static.syscabh.com/ltko/'

  const { control, register, handleSubmit, setValue, getValues } =
    useForm<FormValues>({
      defaultValues: {
        items: [],
      },
    })

  const { fields, append } = useFieldArray({ control, name: 'items' })

  const [loadPicturesFromRegistrationNumbers, { loading, error }] =
    useLoadPicturesFromRegistrationNumbersLazyQuery({
      fetchPolicy: 'network-only',
    })

  // mutations
  const [studentPicturesImportCancel, { loading: cancelLoading }] =
    useStudentPicturesImportCancelMutation()
  const [studentPicturesSave, { loading: saveLoading }] =
    useStudentPicturesSaveMutation()

  const handleImport = () => {
    if (!path) {
      toast.warning(t('Veuillez spécifier le chemin du dossier'))
      return
    }
    setValue('items', [])

    loadPicturesFromRegistrationNumbers({
      variables: {
        schoolId: enterpriseId!,
        folderName: path,
      },
    })
      .then(({ data }) => {
        if (data?.students) {
          setShowUpload(false)
          data?.students.forEach((student) => {
            append({
              registrationNumber: student.registrationNumber,
              picture: student.picture,
              studentId: student.studentId,
              lastName: student.lastName,
              firstName: student.firstName,
              gender: student.gender?.charAt(0),
              birthDate: student.birthDate,
              birthplace: student.birthplace,
            })
          })
        }
      })
      .catch((error) => {
        setValue('items', [])
        setShowUpload(true)
        toast.error(formatError(error))
        console.log(error)
      })
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    //formatting items
    const items = data.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          studentId: item.studentId ? Number(item.studentId) : null,
          picture: item.picture,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    studentPicturesSave({
      variables: {
        pictures: items,
        schoolId: Number(enterpriseId),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Import terminé avec succès`, {
          ...TOAST_OPTIONS,
        })
        setShowUpload(true)
      })
      .catch((error) => {
        toast.error(`Impossible d'importer le fichier : ${formatError(error)}`)
      })
  }

  const itemValid = (item: any) => {
    const { studentId, picture } = item
    return studentId && picture
  }

  const cancelImport = () => {
    const items = getValues('items')
    studentPicturesImportCancel({
      variables: {
        schoolId: Number(enterpriseId),
        pictures: items.map((item: any) => item.picture),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Import annulé avec succès`, {
          ...TOAST_OPTIONS,
        })
        setShowUpload(true)
      })
      .catch((error) => {
        toast.error(`Impossible d'annuler l'import : ${formatError(error)}`)
      })
  }

  return (
    <Scrollbar className="flex flex-col w-full h-full bg-gray-50 dark:!bg-gray-900 p-6">
      {/* Display uload error */}
      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-2 rounded-lg mb-2 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {formatError(error)}
        </div>
      )}
      <div className={showUpload ? 'w-full max-w-3xl mx-auto' : 'hidden'}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Image size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('sidebar.students.batchPicture')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Importez massivement les photos des élèves depuis un dossier local.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:!bg-dark2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            {/* Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <Info
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Comment ça marche ?</p>
                <p>
                  Le dossier spécifié doit contenir les photos des élèves. Le
                  nom de chaque fichier image doit correspondre exactement au{' '}
                  <strong>matricule de l'élève</strong> (ex:{' '}
                  <code>MAT123.jpg</code>).
                </p>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chemin du dossier
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Folder size={18} />
                </div>
                <Input
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-all"
                  placeholder="Ex: D:/Photos/2025-2026"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Entrez le chemin absolu du dossier sur le serveur.
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleImport}
              disabled={loading || !path}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-white font-medium transition-all transform active:scale-[0.98] ${
                loading || !path
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-200 dark:shadow-none'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UploadCloud size={20} />
              )}
              <span>
                {loading ? 'Importation en cours...' : "Lancer l'importation"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={showUpload ? 'hidden' : ''}
      >
        <Table className="table table-bordered table-condensed table-hover0 responsive tableur tableFixHead0">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '10%' }}>{t('label-picture')}</th>
              <th style={{ width: '10%' }}>Id</th>
              <th style={{ width: '10%' }}>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>{t('label-lastName')}</th>
              <th style={{ width: '20%' }}>{t('label-firstName')}</th>
              <th>{t('label-birthDate')}</th>
              <th>{t('label-birthplace')}</th>
              <th>{t('label-gender')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.picture`)}
                    className="hidden"
                  />
                  <img
                    src={baseImageUrl + field.picture}
                    alt={field.registrationNumber}
                    className="w-24 h-24 object-contain mb-2 drop-shadow-sm"
                  />
                </td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.studentId`)}
                    //readOnly={watch(`items.${index}.studentId`) !== undefined}
                    readOnly={field.studentId !== null}
                    className="!h-32"
                    //type="number"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.registrationNumber`)}
                    className="!h-32"
                  />
                </td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.lastName`)}
                    className="!h-32"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.firstName`)}
                    className="!h-32"
                  />
                </td>

                <td>
                  {/* <SimpleInput {...register(`items.${index}.birthDate`)} /> */}
                  <SimpleDatePicker
                    name={`items.${index}.birthDate`}
                    control={control}
                    className="!h-32"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.birthplace`)}
                    className="!h-32"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.gender`)}
                    className="!h-32"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-between mt-2 mb-2">
          <Button
            type="button"
            loading={cancelLoading}
            color="danger"
            className="round text-sm"
            onClick={cancelImport}
          >
            {t('label-cancel')}
          </Button>

          <Button
            type="submit"
            loading={saveLoading}
            color="primary"
            className="round text-sm md:mr-10"
          >
            {t('label-import')}
          </Button>
        </div>
      </Form>
    </Scrollbar>
  )
}

export default BatchStudentPicture

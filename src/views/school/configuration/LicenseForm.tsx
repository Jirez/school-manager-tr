import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { Form } from 'reactstrap'

// import config from 'config';
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import RestDataSource from '@/utils/RestDataSource'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  EncodeLicenseDocument,
  LoadLicenseFromFileDocument,
} from '@/gql/graphql'

interface LicenseFormProps {
  action?: (variables: any) => Promise<any>
  onCancel?: () => void
  loading?: boolean
}

const LicenseForm: FC<LicenseFormProps> = (props) => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()

  useEffect(() => {
    fetch('/configuration.json')
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load configuration:', err)
        setIsLoading(false)
      })
  }, [])

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeLicenseDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const load = async (fileName: string) => {
    //@ts-ignore
    const { data } = await client.query({
      query: LoadLicenseFromFileDocument,
      variables: { file: fileName },
      fetchPolicy: 'network-only',
    }) //.catch(e => toast.error("Erreur lors du chargement de la licence"));

    return data
  }

  const handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!values.file) {
      toast.error('Veuillez fournir le fichier contenant la licence')
      return
    }

    if (!config) {
      toast.error('Configuration non chargée. Veuillez réessayer.')
      return
    }

    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', values.file)
    formData.append('picturePath', config?.picturePath || 'C:/Temp/')

    const callback = async (datum: any) => {
      const licenseJson = await load(`${config?.picturePath}${datum}`)
      const license = licenseJson.license

      const data = license
        ? await encode({
            licenseKey: license.licenseKey,
            enterpriseName: license.enterpriseName,
            expiryDate: license.expiryDate,
            enterpriseId: Number(license.enterpriseId),
            schoolYearId: Number(license.schoolYearId),
            subPeriods: license.subPeriods,
          })
        : null

      if (!data) {
        toast.error('Erreur lors du chargement de la licence')
        return
      }

      props
        .action?.({
          variables: {
            config: {
              configData: data.configData,
              configurationPK: { key: 'License', enterpriseId: enterpriseId },
            },
          },
        })
        .then(async ({ data }) => {
          toast.success(`Licence enregistrée`, { ...TOAST_OPTIONS })
          props.onCancel?.()
        })
        .catch((error) => {
          toast.error(`Impossible d'enregistrer la licence: ${error.message}`)
        })
    }

    dataSource.upload(`import/license`, formData, callback).catch((error) => {
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
    <Form onSubmit={handleSubmit}>
      <FileUpload
        accept=".txt,text/plain"
        hint="Fichiers acceptés: .txt"
        onChange={(data: any) => setValues({ file: data[0] })}
      />

      <ActionButtons
        cancelAction={props.onCancel}
        isSubmitting={props.loading}
        popover={true}
        dirty={false}
        onSubmit={handleSubmit}
      />
    </Form>
  )
}

export default LicenseForm

import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodePictureDocument } from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
} from './config-form-helper'
import { Folder } from 'lucide-react'

interface PictureType {
  picturePath: string
}

interface Props {
  picture?: PictureType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const PictureForm: FC<Props> = ({ picture, action, onCancel, ...props }) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodePictureDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<PictureType>({
    defaultValues: {
      picturePath: picture?.picturePath || 'C:/eps-technologies/html/pictures/',
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)
      // console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'Picture',
              enterpriseId: enterpriseId,
            },
          },
        },
      })
        .then(async () => {
          // form.resetFields();
          toast.success(`Configuration effectuée`, { ...TOAST_OPTIONS })
          if (onCancel) {
            onCancel()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de modifier la configuration: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* Picture Path Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Folder size={16} />
            </SectionIcon>
            <SectionTitle>Configuration du chemin des photos</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <Input
                name="picturePath"
                label={t('label-picturePath')}
                control={control}
              />
            </FieldGroup>
          </FieldGrid>
        </Section>
      </FormContainer>

      <ActionButtons
        cancelAction={onCancel}
        isSubmitting={props.loading}
        popover={true}
        dirty={isDirty}
        onSubmit={onSubmit}
        saveLabel={picture ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default PictureForm

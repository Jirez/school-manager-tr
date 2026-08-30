import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeStudentInvoiceDocument } from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
  SwitchWrapper,
} from './config-form-helper'
import { Hash, FileCheck } from 'lucide-react'

interface StudentInvoiceType {
  prefix: string
  radical:
    'SHORT_YEAR' | 'FULL_YEAR' | 'FULL_YEAR_MONTH_DAY' | 'SHORT_YEAR_MONTH_DAY'
  suffixLength: number
  resetNumberOrder: boolean
  compulsory: boolean
}

interface Props {
  studentInvoice?: StudentInvoiceType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const StudentInvoiceForm: FC<Props> = ({
  studentInvoice,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeStudentInvoiceDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    getValues,
  } = useForm<StudentInvoiceType>({
    defaultValues: {
      radical: studentInvoice?.radical || 'FULL_YEAR',
      prefix: studentInvoice ? studentInvoice.prefix : 'F',
      suffixLength: studentInvoice?.suffixLength || 4,
      resetNumberOrder: studentInvoice ? studentInvoice.resetNumberOrder : true,
      compulsory: studentInvoice ? studentInvoice.compulsory : false,
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode({
        radical: values.radical,
        prefix: values.prefix,
        suffixLength: Number(values.suffixLength),
        resetNumberOrder: values.resetNumberOrder,
        compulsory: values.compulsory,
      })
      //console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'StudentInvoice',
              enterpriseId: enterpriseId,
            },
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
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
        {/* Numbering Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Hash size={16} />
            </SectionIcon>
            <SectionTitle>Configuration de numérotation</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="prefix"
                label={t('label-prefix')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="radical"
                label={t('label-radicalType')}
                control={control}
                type="select"
              >
                <option value={'SHORT_YEAR'}>{dayjs().format('YY')}</option>
                <option value={'FULL_YEAR'}>{dayjs().format('YYYY')}</option>
              </Input>
            </FieldGroup>
            <FieldGroup>
              <Input
                name="suffixLength"
                label={t('label-suffixLength')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="resetNumberOrder"
                  label={t('label-resetNumberOrder')}
                  control={control}
                  defaultChecked={getValues('resetNumberOrder')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Invoice Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FileCheck size={16} />
            </SectionIcon>
            <SectionTitle>Paramètres de facture</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="compulsory"
                  label={t('label-invoiceIsCompulsory')}
                  control={control}
                  defaultChecked={getValues('compulsory')}
                />
              </SwitchWrapper>
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
        saveLabel={studentInvoice ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default StudentInvoiceForm

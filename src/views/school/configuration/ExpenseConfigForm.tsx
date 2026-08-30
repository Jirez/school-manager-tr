import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeExpenseDocument } from '@/gql/graphql'
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
import { Receipt } from 'lucide-react'

interface ExpenseType {
  voucherCompulsory: boolean
}

interface Props {
  expense?: ExpenseType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const ExpenseConfigForm: FC<Props> = ({
  expense,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeExpenseDocument,
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
  } = useForm<ExpenseType>({
    defaultValues: {
      voucherCompulsory: expense ? expense.voucherCompulsory : false,
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)
      //console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'Expense',
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
        {/* Expense Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Receipt size={16} />
            </SectionIcon>
            <SectionTitle>Paramètres de dépense</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="voucherCompulsory"
                  label={t('label-voucherCompulsory')}
                  control={control}
                  defaultChecked={getValues('voucherCompulsory')}
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
        saveLabel={expense ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default ExpenseConfigForm

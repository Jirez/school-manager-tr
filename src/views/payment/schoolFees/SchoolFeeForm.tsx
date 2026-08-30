import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import type { SchoolFeeType } from '@/views/payment/schoolFees/SchoolFee.type'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
// import dayjs from "dayjs";
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { schoolFeeValidationSchema } from '@/views/payment/schoolFees/schoolFee.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SpecialAccountCreatedDocument,
  useSpecialAccountsQuery,
} from '@/gql/graphql'

interface SchoolFeeFormProps extends BaseFormProps {
  schoolFee?: SchoolFeeType
  modal?: NiceModalHandler
}

const initialValues: Partial<SchoolFeeType> = {
  numberOrder: undefined,
  name: '',
  name2: '',
  code: '',
  mandatory: true,
  active: true,
  note: '',
  //deadline: null,
  saleAccountId: null,
}

const SchoolFeeForm: FC<SchoolFeeFormProps> = ({
  schoolFee,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useSpecialAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    getValues,
  } = useForm<SchoolFeeType>({
    defaultValues: {
      saleAccountId: schoolFee ? schoolFee.saleAccount : null,
      mandatory: schoolFee ? schoolFee.mandatory : true,
      //deadline: schoolFee ? dayjs(schoolFee.deadline).toDate() : null,
      numberOrder: schoolFee?.numberOrder || null,
      name: schoolFee?.name || '',
      name2: schoolFee?.name2 || '',
      code: schoolFee?.code || '',
      active: schoolFee ? schoolFee.mandatory : true,
      note: schoolFee?.note || '',
    },
    resolver: yupResolver(schoolFeeValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = schoolFee ? Number(schoolFee.id) : undefined

      action({
        variables: {
          schoolFee: {
            ...values,
            id,
            saleAccountId: values.saleAccountId
              ? Number(values.saleAccountId.id)
              : null,
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Droit exigible ${data.schoolFee.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('schoolFee', data.schoolFee)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le droit exigible: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <LiveView
        document={SpecialAccountCreatedDocument}
        subscribeToMore={subscribeToMoreAccount}
        listVar="specialAccounts"
        singleVar="specialAccount"
        data={dataAccount}
        enterpriseId={enterpriseId}
      >
        {({ specialAccounts }) => (
          <ControlledSelect
            name="saleAccountId"
            label={t('label-saleAccount')}
            control={control}
            loading={loadingAccount}
            onChange={(val) => setValue('saleAccountId', val)}
            options={
              specialAccounts
                ? specialAccounts.filter(
                    ({ specialAccountType }: any) =>
                      specialAccountType === 'SALE',
                  )
                : undefined
            }
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            formId="specialAccount"
            optionLabel="name"
            defaultValue={
              schoolFee
                ? schoolFee.saleAccount
                : specialAccounts
                  ? specialAccounts.filter(
                      ({ specialAccountType, selected }: any) =>
                        specialAccountType === 'SALE' && selected,
                    )[0]
                  : null
            }
          />
        )}
      </LiveView>

      <Input
        name="numberOrder"
        label={t('label-numberOrder')}
        control={control}
        required={true}
        type="number"
      />

      <Input
        name="code"
        label={t('label-code')}
        control={control}
        required={true}
      />

      <Input
        name="name"
        label={t('label-name')}
        control={control}
        required={true}
      />

      <Input
        name="name2"
        label={t('label-name2')}
        control={control}
        required={true}
      />

      <Switch
        name="active"
        label={t('label-active')}
        control={control}
        defaultChecked={getValues('active')}
      />

      <Switch
        name="mandatory"
        label={t('label-mandatory')}
        control={control}
        defaultChecked={getValues('mandatory')}
      />

      <Input
        name="note"
        label={t('label-note')}
        control={control}
        type="textarea"
      />

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
      />
    </Form>
  )
}

export default SchoolFeeForm

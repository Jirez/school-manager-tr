import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import type {
  SchoolFeeLevelItemItemType,
  SchoolFeeLevelType,
} from './SchoolFeeLevel.type'
import SFLItemForm from './SFLItemForm'

interface FormValues {
  items: SchoolFeeLevelType[]
}

interface CompetenceFormProps extends BaseFormProps {
  fees: SchoolFeeLevelType[]
  levelId: number
}

const SimpleSchoolFeeLevelForm: FC<CompetenceFormProps> = ({
  fees,
  action,
  ...props
}) => {
  const { t } = useTranslation()

  const { control, handleSubmit, register, getValues, watch } =
    useForm<FormValues>({
      defaultValues: {
        items: fees,
      },
    })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item) => itemValid(item))
      .map((item) => {
        return {
          paymentGroupId: Number(item.paymentGroupId),
          paymentGroupName: item.paymentGroupName,
          items: item.items
            .filter(
              ({ paymentSliceId, items }) =>
                paymentSliceId && subItemValid(items),
            )
            .map((i) => ({
              paymentSliceId: i.paymentSliceId,
              paymentSliceName: i.paymentSliceName,
              items: i.items
                .filter(
                  ({ schoolFeeId, requiredAmount }) =>
                    schoolFeeId && requiredAmount,
                )
                .map((i) => ({
                  schoolFeeId: Number(i.schoolFeeId),
                  schoolFeeName: i.schoolFeeName,
                  requiredAmount: Number(i.requiredAmount),
                })),
            })),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }
    //console.log(items);

    action({
      variables: {
        form: items,
        levelId: Number(props.levelId),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Montants des droits enregistrés`, { ...TOAST_OPTIONS })
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les montants des droits : ${formatError(
            error,
          )}`,
        )
      })
  }

  const itemValid = (item: SchoolFeeLevelType) => {
    const { items } = item
    return (
      items.filter(
        ({ paymentSliceId, items }) => paymentSliceId && subItemValid(items),
      ).length > 0
    )
  }

  const subItemValid = (items: SchoolFeeLevelItemItemType[]) => {
    return (
      items.filter(
        ({ schoolFeeId, requiredAmount }) => schoolFeeId && requiredAmount,
      ).length > 0
    )
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="border-b p-1">
            <div className="font-medium pl-1">
              Groupe : {field.paymentGroupName}
            </div>
            <div>
              <SFLItemForm
                nestIndex={index}
                getValues={getValues}
                {...{ control, register, watch }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2 mb-2">
        <Button loading={props.loading} color="primary" className="round">
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default SimpleSchoolFeeLevelForm

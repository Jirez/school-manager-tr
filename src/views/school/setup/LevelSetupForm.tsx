import { Form, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { Draft } from 'immer'
import { produce } from 'immer'
import {
  Plus,
  Trash2,
  ListOrdered,
  Type,
  Layers,
  Settings,
  RefreshCw,
  GitBranch,
  School,
} from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import SimpleInput from '@/@core/components/ui/simple-input'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { useEffect } from 'react'
import {
  useCyclesQuery,
  useInitLevelsQuery,
  useLevelsSaveMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import WizardButtons from './WizardButtons'
import FormSection from '@/@core/components/ui/forms/form-section'

interface Props {
  stepper: any
}

interface FormValues {
  items: Item[]
}

interface Item {
  name: string
  branchCount: number | string
  classCount: number | string
  numberOrder: number | string
  cycleId: any
  cycle?: {
    id: number
    name: string
  }
}

const LevelSetupForm: React.FC<Props> = ({ stepper }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useCyclesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataLevels } = useInitLevelsQuery({
    variables: { schoolId: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [saveLevels, { loading: loadingMutation }] = useLevelsSaveMutation()

  const {
    control,
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  useEffect(() => {
    setValue('items', [])

    if (dataLevels && dataLevels.levels) {
      const defaultValues = dataLevels.levels.map((value) => ({
        cycleId: value.cycle,
        name: value.name,
        branchCount: value.branchCount,
        classCount: value.classCount,
        numberOrder: value.numberOrder,
      }))
      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i] as any)
      }
    }
  }, [dataLevels])

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      //.filter((item: any) => itemValid(item))
      .map((item: Item) => ({
        cycleId: Number(item.cycleId.id),
        name: item.name,
        classCount: Number(item.classCount),
        branchCount: Number(item.branchCount),
        numberOrder: Number(item.numberOrder),
      }))

    saveLevels({
      variables: {
        items,
        schoolId: enterpriseId,
      },
    })
      .then(() => {
        toast.success(t('action.saveComplete').toString(), {
          ...TOAST_OPTIONS,
        })
        stepper.next()
      })
      .catch((error) => {
        toast.error(`${t('action.saveError')}: ${formatError(error)}`)
      })
  }

  const onCycleChange = (val: any, k: number) => {
    const items = getValues('items')
    const updatedItems = produce(items, (draftState: Draft<any>) => {
      draftState[k].cycleId = val
    })

    setValue('items', updatedItems)
  }

  const focusNextField = (index: number, name: string) => {
    return (e: any) => {
      if (e.which === 13) {
        const input = document.getElementById(`items.${index + 1}.${name}`)
        input?.focus()
      }

      if (e.key === 'ArrowDown') {
        const input = document.getElementById(`items.${index + 1}.${name}`)
        input?.focus()
      }

      if (e.key === 'ArrowUp') {
        const input = document.getElementById(`items.${index - 1}.${name}`)
        input?.focus()
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSection
          title={t('label-levels') || 'Niveaux'}
          description={
            t('label-levelDetails') || "Définissez les niveaux d'enseignement"
          }
          icon={<Layers size={18} />}
          color="#7367f0"
          className="w-full"
        >
          <div className="overflow-x-auto -mx-1 px-0">
            <Table className="table align-middle border-0 mb-0">
              <thead className="bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-sm sticky top-0 z-10">
                <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                  <th className="w-10 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-2">
                    #
                  </th>
                  <th
                    style={{ width: '40%' }}
                    className="border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <RefreshCw
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-cycle')}
                    </div>
                  </th>
                  <th className="w-20 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-2">
                    <div className="flex items-center gap-1 justify-center">
                      <ListOrdered
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      Ord.
                    </div>
                  </th>
                  <th className="w-1/4 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-2">
                    <div className="flex items-center gap-1.5">
                      <Type
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-name')}
                    </div>
                  </th>
                  <th className="w-24 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-2">
                    <div className="flex items-center gap-1 justify-center">
                      <GitBranch
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-branchCount')}
                    </div>
                  </th>
                  <th className="w-24 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-2">
                    <div className="flex items-center gap-1 justify-center">
                      <School
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-classCount')}
                    </div>
                  </th>
                  <th className="w-12 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-2">
                    <Settings size={12} className="mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="before:block before:h-0">
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-1">
                      <div className="text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-dashed border-indigo-200 dark:border-indigo-800 py-4 px-6 inline-block">
                        {t(
                          'label-noLevelsYet',
                          'Aucun niveau ajouté. Cliquez sur le bouton ci-dessous pour ajouter.',
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className="
                        bg-white dark:!bg-slate-900
                        border-1 border-indigo-100 dark:border-indigo-800/50
                        rounded-lg
                        transition-all duration-200
                        hover:border-indigo-300 dark:hover:border-indigo-600
                        hover:shadow-md
                      "
                    >
                      <td className="text-center border-0 py-0">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto shadow-sm">
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="border-0 py-0">
                        <ControlledSelect
                          name={`items.${index}.cycleId`}
                          control={control}
                          loading={loading}
                          onChange={(val) => onCycleChange(val, index)}
                          options={data?.cycles || []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          optionLabel="name"
                          className="inline"
                          placeholder={t('label-select')}
                          styles={{
                            control: (provided: any) => ({
                              ...provided,
                              borderRadius: '0px',
                              borderColor: '#c7d2fe',
                            }),
                          }}
                        />
                      </td>
                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.numberOrder`, {
                            required: true,
                          })}
                          className="
                            text-center text-sm font-medium
                            bg-white dark:!bg-slate-800
                            border-0 border-indigo-200 dark:border-indigo-700
                            rounded-none
                            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                            text-gray-900 dark:text-gray-100
                            h-9
                          "
                          invalid={
                            errors.items?.[index]?.numberOrder?.type && true
                          }
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.name`, {
                            required: true,
                          })}
                          className="
                            w-full text-sm font-semibold
                            bg-white dark:!bg-slate-800
                            border-0 border-indigo-200 dark:border-indigo-700
                            rounded-none
                            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                            text-gray-900 dark:text-gray-100
                            placeholder:text-gray-400
                            h-9
                          "
                          invalid={errors.items?.[index]?.name?.type && true}
                          placeholder="Nom du niveau"
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.branchCount`, {
                            required: true,
                          })}
                          type="number"
                          className="
                            w-full text-center text-sm font-bold
                            bg-white dark:!bg-slate-800
                            border-0 border-indigo-200 dark:border-indigo-700
                            rounded-none
                            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                            text-gray-900 dark:text-gray-100
                            placeholder:text-gray-400
                            h-9
                          "
                          invalid={
                            errors.items?.[index]?.branchCount?.type && true
                          }
                          onKeyUp={focusNextField(index, 'branchCount')}
                          placeholder="0"
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.classCount`, {
                            required: true,
                          })}
                          type="number"
                          className="
                            w-full text-center text-sm font-bold
                            bg-white dark:!bg-slate-800
                            border-0 border-indigo-200 dark:border-indigo-700
                            rounded-none
                            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                            text-gray-900 dark:text-gray-100
                            placeholder:text-gray-400
                            h-9
                          "
                          invalid={
                            errors.items?.[index]?.classCount?.type && true
                          }
                          onKeyUp={focusNextField(index, 'classCount')}
                          placeholder="0"
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="
                            p-[5px]
                            text-red-500 hover:text-white
                            bg-red-50 hover:bg-red-500
                            dark:bg-red-900/30 dark:hover:bg-red-600
                            border-2 border-red-200 hover:border-red-500
                            dark:border-red-800 dark:hover:border-red-600
                            rounded-lg
                            transition-all duration-200
                          "
                          title={t('label-delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  text-sm font-semibold
                  text-indigo-700 dark:text-indigo-300
                  bg-indigo-50 hover:bg-indigo-100
                  dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60
                  border-2 border-indigo-300 hover:border-indigo-400
                  dark:border-indigo-700 dark:hover:border-indigo-600
                  rounded-lg
                  transition-all duration-200
                  hover:shadow-md
                "
                onClick={() =>
                  append({
                    branchCount: '',
                    classCount: '',
                    name: '',
                    numberOrder: fields.length + 1,
                    cycleId: null,
                  })
                }
              >
                <Plus size={18} />
                {t('label-addLines')}
              </button>
            </div>
          </div>
        </FormSection>

        <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800">
          <WizardButtons loading={loadingMutation} />
        </div>
      </Form>
    </>
  )
}

export default LevelSetupForm

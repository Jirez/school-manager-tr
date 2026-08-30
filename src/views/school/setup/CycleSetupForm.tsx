import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Form, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import type { Draft } from 'immer'
import { produce } from 'immer'
import { toast } from 'react-toastify'
import {
  Plus,
  Trash2,
  ListOrdered,
  Type,
  Layers,
  BookOpen,
  Settings,
} from 'lucide-react'

import SimpleInput from '@/@core/components/ui/simple-input'
import { useAuthentication } from '@/hooks/useAuthentication'
import WizardButtons from './WizardButtons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  useCyclesSaveMutation,
  useInitCyclesQuery,
  useSchoolSectionsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'

interface Props {
  stepper: any
}

interface FormValues {
  items: Item[]
}

interface Item {
  name: string
  name2: string
  levelCount: number | string
  numberOrder: number | string
  schoolSectionId: any
  schoolSection?: {
    id: number
    name: string
  }
}

const CycleSetupForm: React.FC<Props> = ({ stepper }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const { data: dataCycles } = useInitCyclesQuery({
    variables: { schoolId: enterpriseId },
  })

  const { data, loading } = useSchoolSectionsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [saveCycles, { loading: loadingMutation }] = useCyclesSaveMutation()

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

    if (dataCycles && dataCycles.cycles) {
      const defaultValues = dataCycles.cycles.map((value) => ({
        schoolSectionId: value.schoolSection,
        name: value.name,
        name2: value.name2,
        levelCount: value.levelCount,
        numberOrder: value.numberOrder,
      }))

      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i] as any)
      }
    }
  }, [dataCycles])

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      //.filter((item: any) => itemValid(item))
      .map((item: Item) => ({
        schoolSectionId: Number(item.schoolSectionId.id),
        name: item.name,
        name2: item.name2,
        levelCount: Number(item.levelCount),
        numberOrder: Number(item.numberOrder),
      }))

    saveCycles({
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

  const onSchoolSectionChange = (val: any, k: number) => {
    const items = getValues('items')
    const updatedItems = produce(items, (draftState: Draft<any>) => {
      draftState[k].schoolSectionId = val
    })

    setValue('items', updatedItems)
  }

  const focusNextField = (index: number) => {
    return (e: any) => {
      if (e.which === 13) {
        const input = document.getElementById(`items.${index + 1}.levelCount`)
        input?.focus()
      }

      if (e.key === 'ArrowDown') {
        const input = document.getElementById(`items.${index + 1}.levelCount`)
        input?.focus()
      }

      if (e.key === 'ArrowUp') {
        const input = document.getElementById(`items.${index - 1}.levelCount`)
        input?.focus()
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSection
          title={t('label-cycles') || 'Cycles'}
          description={
            t('label-cycleDetails') || "Définissez les cycles d'enseignement"
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
                      <BookOpen
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-schoolSection')}
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
                  <th className="w-1/4 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-2">
                    <div className="flex items-center gap-1.5">
                      <Type
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-name2')}
                    </div>
                  </th>
                  <th className="w-24 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-2">
                    <div className="flex items-center gap-1 justify-center">
                      <Layers
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      Levels
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
                          'label-noCyclesYet',
                          'Aucun cycle ajouté. Cliquez sur le bouton ci-dessous pour ajouter.',
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
                          name={`items.${index}.schoolSectionId`}
                          control={control}
                          loading={loading}
                          onChange={(val) => onSchoolSectionChange(val, index)}
                          options={data ? data.schoolSections : []}
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
                          placeholder="Nom du cycle"
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.name2`, {
                            required: true,
                          })}
                          className="
                            w-full text-sm
                            bg-white dark:!bg-slate-800
                            border-0 border-indigo-200 dark:border-indigo-700
                            rounded-none
                            focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                            text-gray-600 dark:text-gray-300
                            placeholder:text-gray-400
                            h-9
                          "
                          invalid={errors.items?.[index]?.name2?.type && true}
                          placeholder="Nom alternatif"
                        />
                      </td>

                      <td className="border-0 py-0 !text-center">
                        <SimpleInput
                          {...register(`items.${index}.levelCount`, {
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
                            errors.items?.[index]?.levelCount?.type && true
                          }
                          onKeyUp={focusNextField(index)}
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
                    levelCount: 0,
                    name: '',
                    name2: '',
                    numberOrder: fields.length + 1,
                    schoolSectionId: '',
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

export default CycleSetupForm

import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import type {
  BranchType,
  SubjectBranch,
} from '@/views/school/branches/Branch.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDebounceFn, useEventEmitter } from 'ahooks'
import { toast } from 'react-toastify'
import { useSubjectBranch } from '@/views/school/branches/useSubjectBranch'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { branchOptions, levelOptions } from '@/utils/select/selectComponents'
import LevelAdd from '@/views/school/levels/LevelAdd'
import Input from '@/@core/components/ui/forms/input'
import SubjectAutocompleteHint from '@/utils/SubjectAutocompleteHint'
import SimpleInput from '@/@core/components/ui/simple-input'
import { handleFocusAndScroll, preventSubmitting } from '@/utils/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { branchValidationSchema } from '@/views/school/branches/branch.validation'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  BranchCreatedDocument,
  LevelCreatedDocument,
  useBranchesQuery,
  useLevelsQuery,
} from '@/gql/graphql'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import {
  GraduationCap,
  BookOpen,
  Users,
  Trash2,
  Hash,
  Layers,
  BarChart2,
  Plus,
  FileText,
} from 'lucide-react'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import { styled, keyframes } from 'styled-components'

const config = await fetch('/configuration.json').then((res) => res.json())

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const TableContainer = styled.div`
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(115, 103, 240, 0.05);
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  width: 100%;
  overflow-x: auto;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.95) 0%,
      rgba(40, 48, 70, 0.98) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }
`

const StyledTable = styled.table`
  margin-bottom: 0;
  font-size: 0.875rem;
  background: #f9fafb;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  .dark-layout & {
    background: #1f2937;
  }

  thead {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.12) 0%,
      rgba(115, 103, 240, 0.08) 50%,
      rgba(115, 103, 240, 0.12) 100%
    );
    border-bottom: 2px solid rgba(115, 103, 240, 0.25);

    th {
      padding: 0.875rem 0.75rem;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      border: 1px solid rgba(115, 103, 240, 0.2);
      border-top: none;
      white-space: nowrap;
      vertical-align: middle;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.12) 0%,
        rgba(115, 103, 240, 0.08) 50%,
        rgba(115, 103, 240, 0.12) 100%
      );

      &:first-child {
        text-align: center;
        width: 50px;
        border-top-left-radius: 12px;
        border-left: none;
      }

      &:last-child {
        text-align: center;
        width: 60px;
        border-top-right-radius: 12px;
        border-right: none;
      }

      &:not(:last-child) {
        border-right: 1px solid rgba(115, 103, 240, 0.2);
      }
    }

    .dark-layout & {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.2) 0%,
        rgba(115, 103, 240, 0.15) 50%,
        rgba(115, 103, 240, 0.2) 100%
      );
      border-bottom-color: rgba(115, 103, 240, 0.4);

      th {
        color: #f3f4f6;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        border-color: rgba(115, 103, 240, 0.3);
        background: linear-gradient(
          135deg,
          rgba(115, 103, 240, 0.2) 0%,
          rgba(115, 103, 240, 0.15) 50%,
          rgba(115, 103, 240, 0.2) 100%
        );

        &:not(:last-child) {
          border-right-color: rgba(115, 103, 240, 0.3);
        }
      }
    }
  }

  tbody {
    background: #ffffff;

    .dark-layout & {
      background: #283046;
    }

    tr {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      animation: ${slideIn} 0.3s ease-out;
      animation-fill-mode: both;
      position: relative;

      &:nth-child(even) {
        background: rgba(249, 250, 251, 0.8);
      }

      .dark-layout & {
        &:nth-child(even) {
          background: rgba(31, 41, 55, 0.5);
        }
      }

      &:hover {
        background: linear-gradient(
          90deg,
          rgba(115, 103, 240, 0.08) 0%,
          rgba(115, 103, 240, 0.06) 100%
        ) !important;
        transform: translateX(2px);
        box-shadow: -2px 0 8px rgba(115, 103, 240, 0.15);
      }

      td {
        //padding: 0.75rem 0.5rem;
        border: 1px solid rgba(115, 103, 240, 0.15);
        border-top: none;
        vertical-align: middle;
        transition: all 0.2s ease;
        background: inherit;

        &:first-child {
          text-align: center;
          font-weight: 700;
          color: #7367f0;
          background: linear-gradient(
            135deg,
            rgba(115, 103, 240, 0.08) 0%,
            rgba(115, 103, 240, 0.05) 100%
          );
          border-left: none;
        }

        &:last-child {
          text-align: center;
          border-right: none;
        }

        &:not(:last-child) {
          border-right: 1px solid rgba(115, 103, 240, 0.15);
        }
      }

      &:last-child td {
        border-bottom: none;
      }
    }

    .dark-layout & {
      tr {
        &:hover {
          background: linear-gradient(
            90deg,
            rgba(115, 103, 240, 0.12) 0%,
            rgba(115, 103, 240, 0.08) 100%
          ) !important;
          box-shadow: -2px 0 8px rgba(115, 103, 240, 0.25);
        }

        td {
          border-color: rgba(115, 103, 240, 0.2);
          background: inherit;

          &:first-child {
            color: #a78bfa;
            background: linear-gradient(
              135deg,
              rgba(115, 103, 240, 0.15) 0%,
              rgba(115, 103, 240, 0.1) 100%
            );
          }

          &:not(:last-child) {
            border-right-color: rgba(115, 103, 240, 0.2);
          }
        }
      }
    }
  }
`

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid transparent;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #dc2626;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  .dark-layout & {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;

    &:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
  }
`

interface BranchFormProps extends BaseFormProps {
  branch?: BranchType
  modal?: NiceModalHandler
}

const BranchForm: FC<BranchFormProps> = ({
  branch,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [branchId, setBranchId] = useState<number | null>(null)
  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()
  const reload$ = useEventEmitter()

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataBranch,
    loading: loadingBranch,
    subscribeToMore: subscribeToMoreBranch,
  } = useBranchesQuery({
    variables: { id: enterpriseId },
  })

  const { subjectBranches: modelSubjectBranches } = useSubjectBranch(branchId)

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<BranchType>({
    defaultValues: {
      levelId: branch ? branch.level : null,
      name: branch?.name || '',
      maxStudent: branch?.maxStudent || '',
      classCount: branch?.classCount || '',
      subjectCount: branch?.subjectCount || '',
      items: [],
    },
    resolver: yupResolver(branchValidationSchema),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const { run: focusCoefficientField } = useDebounceFn(
    () => {
      const keys = getValues('items')
      const input = document.getElementById(
        `items.${keys.length - 1}.coefficient`,
      )
      input?.focus()
      bottomTableRef.current?.scrollIntoView(true)
    },
    {
      wait: 500,
    },
  )

  const toSubjectBranch = (item: SubjectBranch) => ({
    subjectBranchPK: {
      subjectId: item.subjectBranchPK.subjectId,
    },
    subjectName: item.subject?.name,
    coefficient: item.coefficient,
    number: item.number,
    scale: item.scale,
    weeklyHourCount: item.weeklyHourCount,
    sessionCount: item.sessionCount,
    maxSessionDuration: item.maxSessionDuration,
    priority: item.priority,
  })

  useEffect(() => {
    if (branch) {
      setBranchId(branch.id!)
    }
  }, [branch])

  useEffect(() => {
    setValue('items', [])

    if (modelSubjectBranches) {
      const defaultValues = modelSubjectBranches.map((value) =>
        toSubjectBranch(value),
      )
      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i])
      }
    }
  }, [modelSubjectBranches])

  const onSubjectFill = (selectedRow: any) => {
    const sb = {
      subjectBranchPK: {
        subjectId: selectedRow.id,
        branchId: undefined,
      },
      subjectName: selectedRow.name,
      coefficient: '',
      weeklyHourCount: null,
      sessionCount: null,
      maxSessionDuration: null,
      priority: null,
      number: null,
      scale: null,
    }

    append(sb, { shouldFocus: true, focusName: 'coefficient' })
    focusCoefficientField()
  }

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = branch ? Number(branch.id) : undefined

      const items = values.items
        ? values.items
            .filter((item: any) => itemValid(item))
            .map((item) => ({
              coefficient: Number(item.coefficient),
              maxSessionDuration: item.maxSessionDuration
                ? Number(item.maxSessionDuration)
                : null,
              number: item.number ? Number(item.number) : null,
              priority: item.priority ? Number(item.priority) : null,
              scale: item.scale ? Number(item.scale) : null,
              sessionCount: item.sessionCount
                ? Number(item.sessionCount)
                : null,
              subjectBranchPK: {
                subjectId: Number(item.subjectBranchPK.subjectId),
              },
              //subjectId: Number(item.subject?.id),
              subjectName: item.subjectName,
              weeklyHourCount: item.weeklyHourCount
                ? Number(item.weeklyHourCount)
                : null,
            }))
        : null

      action({
        variables: {
          branch: {
            id,
            name: values.name,
            maxStudent: values.maxStudent,
            classCount: values.classCount,
            subjectCount: values.subjectCount,
            totalCoefficient: values.totalCoefficient
              ? Number(values.totalCoefficient)
              : null,
            //number: values.number,
            //scale: values.scale,
            subjectBranchCollection: items && items.length > 0 ? items : [],
            levelId: Number(values.levelId.id),
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Série ${data.branch.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('branch', data.branch)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la série: ${formatError(error)}`)
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { coefficient, subjectBranchPK } = item
    return subjectBranchPK && parseFloat(coefficient)
  }

  const isBackNavigation = useActionOnBackNavigation()

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={t('label-basicInformation') || 'Informations de base'}
            description={t('label-branchInfoDesc') || 'Détails académiques'}
            icon={<GraduationCap size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <LiveView
                document={LevelCreatedDocument}
                singleVar="level"
                data={data}
                listVar="levels"
                subscribeToMore={subscribeToMore}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ levels }) => (
                  <ControlledSelect
                    name="levelId"
                    label={t('label-level')}
                    control={control}
                    required={true}
                    onChange={(val) => setValue('levelId', val)}
                    options={levels || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    components={{ Option: levelOptions }}
                    form={<LevelAdd />}
                    formId="level"
                    optionLabel="name"
                    formTitle={t('action.add_level')}
                    isLoading={loading}
                  />
                )}
              </LiveView>

              <Input
                name="name"
                label={t('label-branchName')}
                control={control}
                required={true}
                prepend={<FileText size={14} />}
                placeholder={
                  t('label-branchNamePlaceholder') || 'Nom de la série'
                }
              />

              <LiveView
                document={BranchCreatedDocument}
                singleVar="branch"
                data={dataBranch}
                listVar="branches"
                subscribeToMore={subscribeToMoreBranch}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ branches }) => (
                  <ControlledSelect
                    name="branchId"
                    label={t('label-useModel')}
                    control={control}
                    onChange={(val) => {
                      if (val) {
                        setBranchId(val.id)
                      } else {
                        setBranchId(null)
                      }
                    }}
                    options={branches || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    components={{ Option: branchOptions }}
                    optionLabel="name"
                    isLoading={loadingBranch}
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Statistics Section */}
          <FormSection
            title={t('label-statistics') || 'Statistiques'}
            description={t('label-branchStatsDesc') || 'Capacité et comptage'}
            icon={<BarChart2 size={18} />}
            color="#00cfe8"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              <Input
                name="maxStudent"
                label={t('label-maxStudent')}
                control={control}
                type="number"
                prepend={<Users size={14} />}
                placeholder="0"
              />
              <Input
                name="classCount"
                label={t('label-classCount')}
                control={control}
                type="number"
                prepend={<Layers size={14} />}
                placeholder="0"
              />
              <Input
                name="subjectCount"
                label={t('label-subjectCount')}
                control={control}
                type="number"
                prepend={<BookOpen size={14} />}
                placeholder="0"
              />
              <Input
                name="totalCoefficient"
                label={t('label-totalCoefficient')}
                control={control}
                type="number"
                prepend={<Hash size={14} />}
                placeholder="0"
              />
            </div>
          </FormSection>

          {/* Subjects Section */}
          <FormSection
            title={t('label-subjects') || 'Matières'}
            description={
              t('label-branchSubjectsDesc') || 'Fermer les coefficients'
            }
            icon={<Plus size={18} />}
            color="#28c76f"
            className="md:col-span-2"
          >
            <div className="mb-1">
              <SubjectAutocompleteHint
                onFill={onSubjectFill}
                focus$={focus$}
                reload$={reload$}
              />
            </div>

            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="min-w-56">
                      {t('label-subject') || 'Matière'}
                    </th>
                    <th style={{ width: '4%' }}>
                      {t('label-coefficient') || 'Coefficient'}
                    </th>
                    {config?.schoolCategory === 'PRIMARY' && (
                      <>
                        <th>{t('label-number') || 'Numéro'}</th>
                        <th>{t('label-totalPoints') || 'Total'}</th>
                      </>
                    )}
                    {config?.schoolCategory === 'HIGH' && (
                      <>
                        <th style={{ width: '4%' }}>
                          {t('label-weeklyHourCount') || 'Quota Hebdo'}
                        </th>
                        <th style={{ width: '4%' }}>
                          {t('label-sessionCount') || 'Séances'}
                        </th>
                        <th style={{ width: '4%' }}>
                          {t('label-maxSessionDuration') || 'Durée Max'}
                        </th>
                        <th style={{ width: '4%' }}>
                          {t('label-priority') || 'Priorité'}
                        </th>
                      </>
                    )}
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.length > 0 ? (
                    fields.map((field, index) => (
                      <tr key={field.id}>
                        <td>{index + 1}</td>
                        <td style={{ display: 'none' }}>
                          <SimpleInput
                            {...register(
                              `items.${index}.subjectBranchPK.subjectId`,
                            )}
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <SimpleInput
                            {...register(`items.${index}.subjectName`)}
                            readOnly={true}
                            className="font-medium"
                          />
                        </td>
                        <td>
                          <SimpleInput
                            {...register(`items.${index}.coefficient`)}
                            onKeyPress={preventSubmitting}
                            onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                          />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'PRIMARY'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput {...register(`items.${index}.number`)} />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'PRIMARY'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput {...register(`items.${index}.scale`)} />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'HIGH'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput
                            {...register(`items.${index}.weeklyHourCount`)}
                          />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'HIGH'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput
                            {...register(`items.${index}.sessionCount`)}
                          />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'HIGH'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput
                            {...register(`items.${index}.maxSessionDuration`)}
                          />
                        </td>
                        <td
                          style={{
                            display:
                              config?.schoolCategory === 'HIGH'
                                ? 'table-cell'
                                : 'none',
                          }}
                        >
                          <SimpleInput
                            {...register(`items.${index}.priority`)}
                          />
                        </td>
                        <td>
                          <DeleteButton
                            type="button"
                            onClick={() => remove(index)}
                            title={t('label-remove') || 'Supprimer'}
                          >
                            <Trash2 size={14} />
                          </DeleteButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={config?.schoolCategory === 'PRIMARY' ? 6 : 10}
                        className="py-5 text-center text-muted"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <BookOpen size={24} className="text-secondary" />
                          <span>
                            {t('label-noSubjects') || 'Aucune matière ajoutée.'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </StyledTable>
            </TableContainer>
            <span ref={bottomTableRef} />
          </FormSection>
        </div>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default BranchForm

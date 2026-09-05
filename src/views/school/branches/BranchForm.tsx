import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toSubjectBranch } from '@/views/school/branches/Branch.type'
import type { BranchType } from '@/views/school/branches/Branch.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import { useEventEmitter } from 'ahooks'
import { toast } from 'react-toastify'
import LiveView from '@/utils/LiveView'
import { branchOptions, levelOptions } from '@/utils/select/selectComponents'
import LevelAdd from '@/views/school/levels/LevelAdd'
import SubjectAutocompleteHint from '@/utils/SubjectAutocompleteHint'
import SimpleInput from '@/@core/components/ui/simple-input'
import { handleFocusAndScroll, preventSubmitting } from '@/utils/helpers'
import { branchZodSchema } from '@/views/school/branches/branch.validation'
import type { BranchZodSchemaType } from '@/views/school/branches/branch.validation'
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
import {
  DeleteButton,
  StyledTable,
  TableContainer,
} from '@/@core/components/ui/forms/form.style'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'
import { useSubjectBranch } from './useSubjectBranch'

const config = await fetch('/configuration.json').then((res) => res.json())

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
  const { enterpriseId } = useAuthentication()
  const [branchId, setBranchId] = useState<number | null>(null)
  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()

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
    handleSubmit,
    AppField,
    reset,
    AppForm,
    SubmitButton,
    setFieldValue,
    pushFieldValue,
    getFieldValue,
  } = useAppForm({
    defaultValues: {
      levelId: branch ? branch.level : null,
      name: branch?.name || '',
      maxStudent: branch?.maxStudent || '',
      classCount: branch?.classCount || '',
      subjectCount: branch?.subjectCount || '',
      totalCoefficient: branch?.totalCoefficient || null,
      items: branch ? branch.items : [],
    } as BranchZodSchemaType,
    validators: {
      // @ts-ignore desc
      onChange: branchZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = branch ? Number(branch.id) : undefined
      const values = branchZodSchema.parse(value)

      const items =
        values.items.length > 0
          ? values.items
              .filter((item) => itemValid(item))
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
            subjectBranchCollection: items && items.length > 0 ? items : [],
            levelId: Number(values.levelId.id),
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Série ${result.branch.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('branch', result.branch)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la série: ${formatError(error)}`)
        })
    },
  })

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

  useEffect(() => {
    if (branchId) {
      setFieldValue('items', [])

      if (modelSubjectBranches) {
        const defaultValues = modelSubjectBranches.map((value) =>
          toSubjectBranch(value),
        )
        for (let i = 0; i < defaultValues.length; i++) {
          pushFieldValue('items', defaultValues[i])
        }
      }
    }
  }, [modelSubjectBranches, branchId])

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

    const items = getFieldValue('items')
    pushFieldValue('items', sb as any)
    // Focus on coefficient field after adding
    // get the updated items

    setTimeout(() => {
      // const items = store.state.values.items || []
      const input = document.getElementById(
        `items[${items.length}].coefficient`,
      )
      input?.focus()
      bottomTableRef.current?.scrollIntoView(true)
    }, 500)
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={m.label_basicInformation()}
            description={m.label_branchInfoDesc()}
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
                  <AppField
                    name="levelId"
                    children={(field) => (
                      <field.ControlledSelect
                        label={m.label_level()}
                        required={true}
                        options={levels || undefined}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: levelOptions }}
                        form={<LevelAdd />}
                        formId="level"
                        optionLabel="name"
                        formTitle={m.action_add_level()}
                        isLoading={loading}
                        onChange={(val) => setFieldValue('levelId', val)}
                      />
                    )}
                  />
                )}
              </LiveView>

              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_branchName()}
                    required={true}
                    prepend={<FileText size={14} />}
                    placeholder={m.label_branchNamePlaceholder()}
                  />
                )}
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
                  <AppField
                    name="branchId"
                    children={(field) => (
                      <field.ControlledSelect
                        label={m.label_useModel()}
                        options={branches || undefined}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: branchOptions }}
                        optionLabel="name"
                        isLoading={loadingBranch}
                        onChange={(val) => {
                          // setFieldValue('branchId', val)
                          if (val) {
                            setBranchId(val.id)
                          } else {
                            setBranchId(null)
                          }
                        }}
                      />
                    )}
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Statistics Section */}
          <FormSection
            title={m.label_statistics()}
            description={m.label_branchStatsDesc()}
            icon={<BarChart2 size={18} />}
            color="#00cfe8"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              <AppField
                name="maxStudent"
                children={(field) => (
                  <field.Input
                    label={m.label_maxStudent()}
                    type="number"
                    prepend={<Users size={14} />}
                    placeholder="0"
                  />
                )}
              />
              <AppField
                name="classCount"
                children={(field) => (
                  <field.Input
                    label={m.label_classCount()}
                    type="number"
                    prepend={<Layers size={14} />}
                    placeholder="0"
                  />
                )}
              />
              <AppField
                name="subjectCount"
                children={(field) => (
                  <field.Input
                    label={m.label_subjectCount()}
                    type="number"
                    prepend={<BookOpen size={14} />}
                    placeholder="0"
                  />
                )}
              />
              <AppField
                name="totalCoefficient"
                children={(field) => (
                  <field.Input
                    label={m.label_totalCoefficient()}
                    type="number"
                    prepend={<Hash size={14} />}
                    placeholder="0"
                  />
                )}
              />
            </div>
          </FormSection>

          {/* Subjects Section */}
          <FormSection
            title={m.label_subjects()}
            description={m.label_branchSubjectsDesc()}
            icon={<Plus size={18} />}
            color="#28c76f"
            className="md:col-span-2"
          >
            {/* <SubjectTable
              store={store}
              form={store}
              focus$={focus$}
              onSubjectFill={onSubjectFill}
              onRemove={onRemove}
            /> */}
            <div className="mb-1">
              <SubjectAutocompleteHint
                onFill={onSubjectFill}
                focus$={focus$}
                reload$={useEventEmitter()}
              />
            </div>

            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="min-w-56">{m.label_subject()}</th>
                    <th style={{ width: '4%' }}>{m.label_coefficient()}</th>
                    {config?.schoolCategory === 'PRIMARY' && (
                      <>
                        <th>{m.label_number()}</th>
                        <th>{m.label_totalPoints()}</th>
                      </>
                    )}
                    {config?.schoolCategory === 'HIGH' && (
                      <>
                        <th style={{ width: '4%' }}>
                          {m.label_weeklyHourCount()}
                        </th>
                        <th style={{ width: '4%' }}>
                          {m.label_sessionCount() || 'Séances'}
                        </th>
                        <th style={{ width: '4%' }}>
                          {m.label_maxSessionDuration()}
                        </th>
                        <th style={{ width: '4%' }}>{m.label_priority()}</th>
                      </>
                    )}
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  <AppField name="items" mode="array">
                    {(field) => {
                      if (field.state.value.length === 0) {
                        return (
                          <tr>
                            <td
                              colSpan={
                                config?.schoolCategory === 'PRIMARY' ? 6 : 10
                              }
                              className="py-5 text-center text-muted"
                            >
                              <div className="flex flex-col items-center gap-1">
                                <BookOpen
                                  size={24}
                                  className="text-secondary"
                                />
                                <span>{m.label_noSubjects()}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      }
                      return (
                        <>
                          {field.state.value.map((_, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>

                              <td style={{ display: 'none' }}>
                                <AppField
                                  name={`items[${index}].subjectBranchPK.subjectId`}
                                >
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      readOnly={true}
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td>
                                <AppField name={`items[${index}].subjectName`}>
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      readOnly={true}
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td>
                                <AppField name={`items[${index}].coefficient`}>
                                  {(subField) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(
                                          e.target.value as any,
                                        )
                                      }
                                      // onKeyPress={preventSubmitting}
                                      onKeyUp={(e) => {
                                        preventSubmitting(e)
                                        handleFocusAndScroll(e, focus$)
                                      }}
                                      id={subField.name}
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'PRIMARY'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField name={`items[${index}].number`}>
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'PRIMARY'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField name={`items[${index}].scale`}>
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'HIGH'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField
                                  name={`items[${index}].weeklyHourCount`}
                                >
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'HIGH'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField name={`items[${index}].sessionCount`}>
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'HIGH'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField
                                  name={`items[${index}].maxSessionDuration`}
                                >
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td
                                style={{
                                  display:
                                    config?.schoolCategory === 'HIGH'
                                      ? 'table-cell'
                                      : 'none',
                                }}
                              >
                                <AppField name={`items[${index}].priority`}>
                                  {(subField: any) => (
                                    <SimpleInput
                                      value={subField.state.value || ''}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                    />
                                  )}
                                </AppField>
                              </td>
                              <td>
                                <DeleteButton
                                  type="button"
                                  onClick={() => field.removeValue(index)}
                                  title={m.label_delete()}
                                >
                                  <Trash2 size={14} />
                                </DeleteButton>
                              </td>
                            </tr>
                          ))}
                        </>
                      )
                    }}
                  </AppField>
                </tbody>
              </StyledTable>
            </TableContainer>
            <span ref={bottomTableRef} />
          </FormSection>
        </div>
      </div>

      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default BranchForm

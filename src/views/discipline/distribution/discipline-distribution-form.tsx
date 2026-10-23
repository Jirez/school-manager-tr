import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSelector } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import {
  AlertCircle,
  CheckCircle2,
  Gavel,
  School,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { z } from 'zod'

import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'
import {
  useClassesQuery,
  useDisciplineDistributionQuery,
  useDisciplineDistributionSaveMutation,
} from '@/gql/graphql'
import type { ClassesQuery } from '@/gql/graphql'

interface ClassAssignment {
  classId: number
  className: string
}

interface TeacherAssignment {
  teacherId: number
  teacherFullName: string
  items: ClassAssignment[]
}

type ClassOption = NonNullable<ClassesQuery['clazzes']>[number]

const classAssignmentSchema = z.object({
  classId: z.number().int(),
  className: z.string().min(1),
})

const teacherAssignmentSchema = z.object({
  teacherId: z.number().int(),
  teacherFullName: z.string().min(1),
  items: z.array(classAssignmentSchema),
})

const disciplineDistributionSchema = z.object({
  teachers: z.array(teacherAssignmentSchema).superRefine((teachers, ctx) => {
    const teacherIds = new Set<number>()
    const classIds = new Set<number>()

    teachers.forEach((teacher, teacherIndex) => {
      if (teacherIds.has(teacher.teacherId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Un surveillant ne peut apparaître qu'une seule fois dans la répartition.",
          path: ['teachers', teacherIndex, 'teacherId'],
        })
      }
      teacherIds.add(teacher.teacherId)

      teacher.items.forEach((item, itemIndex) => {
        if (classIds.has(item.classId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Une classe ne peut être affectée qu'à un seul surveillant.",
            path: ['teachers', teacherIndex, 'items', itemIndex, 'classId'],
          })
        }
        classIds.add(item.classId)
      })
    })
  }),
})

const CARD_ACCENTS = [
  {
    header: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    avatar: 'bg-indigo-500',
    badge:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
  {
    header: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-700 dark:text-teal-300',
    avatar: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  },
  {
    header: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    avatar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    header: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    avatar: 'bg-orange-500',
    badge:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
]

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const getClassOptionLabel = (option: ClassOption) => {
  const level = option.branch?.level?.name
  const branch = option.branch?.name
  const details = [level, branch].filter(Boolean).join(' · ')

  return details ? `${option.name} — ${details}` : option.name
}

interface TeacherCardProps {
  index: number
  teacher: TeacherAssignment
  field: AnyFieldApi
  classes: ClassOption[]
  assignedClassIds: Set<number>
}

const TeacherCard: FC<TeacherCardProps> = ({
  index,
  teacher,
  field,
  classes,
  assignedClassIds,
}) => {
  const { t } = useTranslation()
  const [pendingClass, setPendingClass] = useState<ClassOption | null>(null)

  const items = (field.state.value ?? []) as ClassAssignment[]
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]

  const availableClasses = useMemo(
    () => classes.filter((clazz) => !assignedClassIds.has(clazz.id)),
    [classes, assignedClassIds],
  )

  const handleAddClass = (option: ClassOption | null) => {
    if (!option || items.some((item) => item.classId === option.id)) {
      return
    }

    field.pushValue({
      classId: option.id,
      className: option.name,
    })
    setPendingClass(null)
  }

  const handleRemoveClass = (classIndex: number) => {
    field.removeValue(classIndex)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div
        className={`flex items-center justify-between px-3 py-2 ${accent.header}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${accent.avatar}`}
          >
            {getInitials(teacher.teacherFullName)}
          </span>
          <span className={`truncate font-bold ${accent.text}`}>
            {teacher.teacherFullName}
          </span>
        </div>

        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${accent.badge}`}
        >
          {items.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {items.length === 0 ? (
          <p className="text-sm italic text-gray-400 dark:text-gray-500">
            {t(
              'discipline_distribution_noClass',
              'Aucune classe affectée pour le moment',
            )}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {items.map((item, classIndex) => (
              <span
                key={item.classId}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 py-0.5 pl-2 pr-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {item.className}
                <button
                  type="button"
                  onClick={() => handleRemoveClass(classIndex)}
                  className="rounded-full p-0.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title={t('discipline_distribution_removeClass', 'Retirer')}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          <Select
            value={pendingClass}
            onChange={(option) => handleAddClass(option as ClassOption | null)}
            options={availableClasses}
            getOptionLabel={getClassOptionLabel}
            getOptionValue={(option) => String(option.id)}
            placeholder={
              availableClasses.length === 0
                ? t(
                    'discipline_distribution_allClassesAssigned',
                    'Toutes les classes sont affectées',
                  )
                : t(
                    'discipline_distribution_assignClass',
                    'Affecter une classe',
                  )
            }
            isDisabled={availableClasses.length === 0}
            isClearable
            isSearchable
            closeMenuOnSelect
            menuPlacement="auto"
          />
        </div>
      </div>
    </div>
  )
}

interface DisciplineDistributionFormContentProps {
  teachers: TeacherAssignment[]
  classes: ClassOption[]
  schoolId: number
  onSaved?: () => void | Promise<void>
}

const DisciplineDistributionFormContent: FC<
  DisciplineDistributionFormContentProps
> = ({ teachers, classes, schoolId, onSaved }) => {
  const { t } = useTranslation()
  const [saveDistribution] = useDisciplineDistributionSaveMutation()

  const { AppField, AppForm, SubmitButton, handleSubmit, reset, store } =
    useAppForm({
      defaultValues: {
        teachers,
      },
      validators: {
        onChange: disciplineDistributionSchema,
      },
      onSubmitMeta: defaultMeta,
      onSubmit: async ({ value }) => {
        const values = disciplineDistributionSchema.parse(value)

        const distributions = values.teachers
          .filter((teacher) => teacher.items.length > 0)
          .map((teacher) => ({
            teacherId: teacher.teacherId,
            teacherFullName: teacher.teacherFullName,
            items: teacher.items.map((item) => ({
              classId: item.classId,
              className: item.className,
            })),
          }))

        try {
          const result = await saveDistribution({
            variables: {
              distributions,
              schoolId,
            },
          })

          if (!result.data?.disciplineDistributionSave) {
            toast.error(`Impossible d'enregistrer la répartition`)
            return
          }

          reset(values)
          toast.success(`Répartition enregistrée`, { ...TOAST_OPTIONS })

          try {
            await onSaved?.()
          } catch {
            // The distribution was saved; a failed refresh must not be
            // reported as a save failure.
          }
        } catch (error) {
          toast.error(
            `Impossible d'enregistrer la répartition: ${formatError(error)}`,
          )
        }
      },
    })

  const currentTeachers = useSelector(store, (state) => state.values.teachers)

  const assignedClassIds = new Set(
    currentTeachers.flatMap((teacher) =>
      teacher.items.map((item) => item.classId),
    ),
  )
  const unassignedClasses = classes.filter(
    (clazz) => !assignedClassIds.has(clazz.id),
  )

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
      className="flex max-w-7xl flex-col gap-1 mx-auto"
    >
      <FormSection
        icon={<Gavel size={18} />}
        title={m.discipline_distribution()}
        description={t(
          'discipline_distribution_description',
          'Affectez chaque classe à un surveillant. Une classe ne peut être affectée qu’à un seul surveillant.',
        )}
        color="#7367f0"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Users size={15} />
            {currentTeachers.length}{' '}
            {t('discipline_distribution_teachers', 'surveillant(s)')}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <CheckCircle2 size={15} />
            {assignedClassIds.size}/{classes.length}{' '}
            {t(
              'discipline_distribution_classesAssigned',
              'classe(s) affectée(s)',
            )}
          </span>
        </div>

        {classes.length === 0 ? (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>
              {t(
                'discipline_distribution_noClasses',
                "Aucune classe n'est disponible pour l'année scolaire en cours.",
              )}
            </span>
          </div>
        ) : unassignedClasses.length > 0 ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
            <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle size={15} />
              {unassignedClasses.length}{' '}
              {t(
                'discipline_distribution_unassignedClasses',
                'classe(s) non affectée(s)',
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {unassignedClasses.map((clazz) => (
                <span
                  key={clazz.id}
                  className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200 dark:bg-gray-800/60 dark:text-amber-300 dark:ring-amber-900/50"
                >
                  {clazz.name}
                </span>
              ))}
            </div>
          </div>
        ) : classes.length > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>
              {t(
                'discipline_distribution_allClassesCovered',
                'Toutes les classes sont affectées.',
              )}
            </span>
          </div>
        ) : null}
      </FormSection>

      <FormSection
        icon={<Users size={18} />}
        title={t('discipline_distribution_teachersTitle', 'Surveillants')}
        description={t(
          'discipline_distribution_teachersDescription',
          'Ajoutez ou retirez les classes affectées à chaque surveillant.',
        )}
        color="#2f8724"
      >
        {currentTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-10 text-center dark:border-gray-600">
            <UserX size={32} className="text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t(
                'discipline_distribution_noTeacher',
                'Aucun surveillant avec la permission DISCIPLINE_MASTER.',
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {currentTeachers.map((teacher, index) => (
              <AppField
                key={teacher.teacherId}
                name={`teachers[${index}].items`}
                mode="array"
                children={(field) => (
                  <TeacherCard
                    index={index}
                    teacher={teacher}
                    field={field}
                    classes={classes}
                    assignedClassIds={assignedClassIds}
                  />
                )}
              />
            ))}
          </div>
        )}

        {classes.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <School size={13} />
            <span>
              {t(
                'discipline_distribution_hint',
                'Retirez une classe d’un surveillant avant de pouvoir l’affecter à un autre.',
              )}
            </span>
          </div>
        )}
      </FormSection>

      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={() => reset()}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

const DisciplineDistributionForm: FC = () => {
  const { enterpriseId } = useAuthentication()

  const {
    data: distributionData,
    loading: distributionLoading,
    error: distributionError,
    refetch: refetchDistribution,
  } = useDisciplineDistributionQuery({
    variables: { schoolId: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: classesData,
    loading: classesLoading,
    error: classesError,
  } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const teachers = useMemo<TeacherAssignment[]>(
    () =>
      (distributionData?.disciplineDistribution ?? [])
        .filter((teacher): teacher is NonNullable<typeof teacher> =>
          Boolean(teacher),
        )
        .map((teacher) => ({
          teacherId: Number(teacher.teacherId),
          teacherFullName: teacher.teacherFullName,
          items: (teacher.items ?? []).map((item) => ({
            classId: Number(item.classId),
            className: item.className,
          })),
        })),
    [distributionData],
  )

  const classes = useMemo(
    () =>
      [...(classesData?.clazzes ?? [])].sort((first, second) => {
        const firstLevel = first.branch?.level?.name ?? ''
        const secondLevel = second.branch?.level?.name ?? ''

        return (
          firstLevel.localeCompare(secondLevel) ||
          first.name.localeCompare(second.name)
        )
      }),
    [classesData],
  )

  const isLoading =
    (distributionLoading && !distributionData) ||
    (classesLoading && !classesData)

  if (isLoading) {
    return <LoadingSpinner />
  }

  const queryError = distributionError ?? classesError

  if (queryError) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <span>{formatError(queryError)}</span>
      </div>
    )
  }

  return (
    <DisciplineDistributionFormContent
      teachers={teachers}
      classes={classes}
      schoolId={enterpriseId}
      onSaved={refetchDistribution}
    />
  )
}

export default DisciplineDistributionForm

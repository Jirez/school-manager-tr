import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useForm, FormProvider } from 'react-hook-form'
import { Form } from 'reactstrap'
import dayjs from 'dayjs'
import { yupResolver } from '@hookform/resolvers/yup'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useResponsive } from 'ahooks'

import type {
  StudentGuardian,
  StudentType,
} from '@/views/school/students/Student.type'
import StudentFragmentForm from '@/views/school/students/StudentFragmentForm'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { studentValidationSchema } from '@/views/school/students/student.validation'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { setOffcanvasSize } from '@/utils/helpers'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface StudentFormProps extends BaseFormProps {
  student?: StudentType
  modal?: NiceModalHandler
}

const StudentForm: FC<StudentFormProps> = ({
  student,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const responsive = useResponsive()

  const methods = useForm<StudentType>({
    defaultValues: {
      /* registrationNumber: student?.registrationNumber || '',
            lastName: student?.lastName || '',
            firstName: student?.firstName || '',
            birthDate: student ? dayjs(student.birthDate).toDate() : null,
            birthplace: student?.birthplace || '',
            presumeBirthDate: student?.presumeBirthDate ?? false,
            gender: student ? getSelectedGender() : '',
            religion: student?.religion || '',
            bloodGroup: student?.bloodGroup || '',
            knownHealthProblem: student?.knownHealthProblem || '',
            otherUsefulInfo: student?.otherUsefulInfo || '',
            ethnicGroup: student?.ethnicGroup || '',
            rhesus: student?.rhesus || '',
            origin: {
                countryOrigin: student?.origin?.countryOrigin || '',
                regionOrigin: student?.origin?.regionOrigin || '',
                departmentOrigin: student?.origin?.departmentOrigin || '',
                districtOrigin: student?.origin?.districtOrigin || '',
            },
            address: {
                zipCode: student?.address?.zipCode || '',
                country: student?.address?.country || '',
                town: student?.address?.town || '',
                state: student?.address?.state || '',
                street: student?.address?.street || '',
            },
            contactInfo: {
                fax: student?.contactInfo?.fax || '',
                email: student?.contactInfo?.email || '',
                mobile: student?.contactInfo?.mobile || '',
                telephone: student?.contactInfo?.telephone || '',
                postOfficeBox: student?.contactInfo?.postOfficeBox || '',
            }, */
      items: [],
    },
    resolver: yupResolver(studentValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return methods.handleSubmit(async (values) => {
      const id = student ? Number(student.id) : undefined
      const { items, ...rest } = values

      //formatting student guardians
      const guardians = items
        .filter((item) => itemValid(item))
        .map((item) => ({
          studentGuardianPK: {
            studentId: id,
            guardianId: Number(item.studentGuardianPK.guardianId),
          },
          relation: (item.relation as any)?.value || item.relation,
        }))

      action({
        variables: {
          student: {
            ...rest,
            id,
            birthDate: dayjs(values.birthDate).format(INPUT_DATE_FORMAT),
            gender: rest.gender.value,
            schoolId: enterpriseId,
            enterpriseId: enterpriseId,
            studentGuardianCollection: guardians,
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          props.refetch?.()
          toast.success(`Elève ${data.student.lastName} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('student', data.student)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter l'élève: ${t(formatError(error))}`)
          //console.log(error.message)
        })
    })(event)
  }

  const itemValid = (item: StudentGuardian) => {
    const { relation, studentGuardianPK } = item

    return relation && studentGuardianPK.guardianId
  }

  useEffect(() => {
    if (responsive['lg']) {
      setOffcanvasSize('70%')
    } else {
      if (responsive['md']) {
        setOffcanvasSize('90%')
      } else {
        setOffcanvasSize('100%')
      }
    }
  }, [responsive])

  const isBackNavigation = useActionOnBackNavigation()

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <FormProvider {...methods}>
      <Form onSubmit={onSubmit} className="p-0">
        <div className="px-2 pb-2">
          <StudentFragmentForm student={student} />
        </div>

        <StickyActions>
          <ActionButtons
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            dirty={methods.formState.isDirty}
            onSubmit={onSubmit}
            fixed={false}
          />
        </StickyActions>
      </Form>
    </FormProvider>
  )
}

export default StudentForm

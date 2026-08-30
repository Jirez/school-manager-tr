import React, { useEffect } from 'react'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import type { NiceModalHandler } from '@ebay/nice-modal-react'

import {
  User,
  Briefcase,
  DollarSign,
  Users,
  Building,
  IdCard,
  CheckCircle,
  FileText,
} from 'lucide-react'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DatePicker from '@/@core/components/ui/forms/date-picker'
// import { default as DatePicker } from "@components/ui/forms/material-date-picker";
import Input from '@/@core/components/ui/forms/input'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import dayjs from 'dayjs'
import type { EmployeeType } from './employee.type'
import {
  DepartmentCreatedDocument,
  PositionCreatedDocument,
  useDepartmentsQuery,
  useNonEmployeePersonnelQuery,
  usePositionsQuery,
} from '@/gql/graphql'
import PositionAdd from '../position/PositionAdd'
import { employeeValidation } from './employee.validation'
import DepartmentAdd from '@/views/payroll/department/DepartmentAdd'
import {
  personOptions,
  personSingleValue,
} from '@/utils/select/selectComponents'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface FormProps extends BaseFormProps {
  employee?: EmployeeType
  modal?: NiceModalHandler
}

const EmployeeForm: React.FC<FormProps> = ({
  employee,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useNonEmployeePersonnelQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataDepartment,
    loading: loadingDepartment,
    subscribeToMore: subscribeToMoreDepartment,
  } = useDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataPosition,
    loading: loadingPosition,
    subscribeToMore: subscribeToMorePosition,
  } = usePositionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
    watch,
    register,
  } = useForm<EmployeeType>({
    defaultValues: {
      hireDate: employee
        ? employee.hireDate
          ? dayjs(employee.hireDate).toDate()
          : null
        : null,
      terminationDate: employee
        ? employee.terminationDate
          ? dayjs(employee.terminationDate).toDate()
          : null
        : null,
      nsifNumber: employee?.nsifNumber || '',
      employmentStatus: employee?.employmentStatus || 'ACTIVE',
      employmentType: employee?.employmentType || 'FULL_TIME',
      payType: employee?.payType || 'SALARY',
      hourlySalary: employee?.hourlySalary || null,
      hourlySalaryF: employee?.hourlySalary || null,
      baseSalary: employee?.baseSalary || null,
      baseSalaryF: employee?.baseSalary || null,
      departmentId: employee ? employee.department : null,
      positionId: employee ? employee.position : null,
      personnelId: employee ? employee.personnel : null,
    },
    resolver: yupResolver(employeeValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (data) => {
      const id = employee ? Number(employee.id) : undefined
      const { baseSalaryF, hourlySalaryF, ...values } = data

      action({
        variables: {
          employee: {
            ...values,
            id: id,
            personnelId: values.personnelId
              ? Number(values.personnelId.id)
              : null,

            hireDate: dayjs(values.hireDate).isValid()
              ? dayjs(values.hireDate).format(INPUT_DATE_FORMAT)
              : null,
            terminationDate: dayjs(values.terminationDate).isValid()
              ? dayjs(values.terminationDate).format(INPUT_DATE_FORMAT)
              : null,

            enterpriseId,
            baseSalary: values.baseSalary ? Number(values.baseSalary) : null,
            hourlySalary: values.hourlySalary
              ? Number(values.hourlySalary)
              : null,
            departmentId: values.departmentId
              ? Number(values.departmentId.id)
              : null,
            positionId: values.positionId ? Number(values.positionId.id) : null,
            employmentType: values.employmentType
              ? values.employmentType
              : null,
            employmentStatus: values.employmentStatus
              ? values.employmentStatus
              : null,
            nsifNumber: values.nsifNumber ? values.nsifNumber : null,
          },
        },
      })
        .then(async ({ data }) => {
          //reset()
          toast.success(`Employee ${data.employee.displayName} ajouté`, {
            ...TOAST_OPTIONS,
          })
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage('employee', data.employee)
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter l'employé : ${formatError(error)}`)
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'department') {
          setValue('departmentId', message.value)
        }
      }

      if (message) {
        if (message.name === 'position') {
          setValue('positionId', message.value)
        }
      }
    })
  }, [messageService])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Personnel & Assignment Section */}
        <FormSection
          title={t('label-assignment') || 'Affectation'}
          description={
            t('label-assignmentDesc') || 'Personnel, département et poste'
          }
          icon={<Users size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <ControlledSelect
              control={control}
              name="personnelId"
              label={t('label-personnel')}
              required
              prepend={<User size={16} />}
              options={
                data && data.personnel
                  ? data.personnel.filter((u: any) => u.active)
                  : []
              }
              onChange={(val) => setValue('personnelId', val)}
              getOptionLabel={(o) => o.lastName + ' ' + (o.firstName ?? '')}
              getOptionValue={(o) => o.id}
              className="w-full"
              formId="personnel"
              optionLabel="lastName"
              modalClassName="modal-md"
              components={{
                Option: personOptions,
                SingleValue: personSingleValue,
              }}
            />

            <LiveView
              document={DepartmentCreatedDocument}
              subscribeToMore={subscribeToMoreDepartment}
              data={dataDepartment}
              listVar="departments"
              singleVar="department"
              loading={loading}
              enterpriseId={enterpriseId}
            >
              {({ departments }) => (
                <ControlledSelect
                  control={control}
                  name="departmentId"
                  label={t('label-department')}
                  prepend={<Building size={16} />}
                  options={
                    departments ? departments.filter((u: any) => u.active) : []
                  }
                  onChange={(val) => setValue('departmentId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  className="w-full"
                  formId="department"
                  form={<DepartmentAdd />}
                  optionLabel="name"
                  formTitle={t('action.add_department')}
                  modalClassName="modal-md"
                />
              )}
            </LiveView>

            <LiveView
              document={PositionCreatedDocument}
              subscribeToMore={subscribeToMorePosition}
              data={dataPosition}
              listVar="positions"
              singleVar="position"
              loading={loading}
              enterpriseId={enterpriseId}
            >
              {({ positions }) => (
                <ControlledSelect
                  control={control}
                  name="positionId"
                  label={t('label-position')}
                  prepend={<Briefcase size={16} />}
                  options={
                    positions ? positions.filter((u: any) => u.active) : []
                  }
                  onChange={(val) => setValue('positionId', val)}
                  getOptionLabel={(o) => o.title}
                  getOptionValue={(o) => o.id}
                  className="w-full"
                  formId="position"
                  form={<PositionAdd />}
                  optionLabel="title"
                  formTitle={t('action.add_position')}
                  modalClassName="modal-md"
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Administrative Details Section */}
        <FormSection
          title={t('label-administrative') || 'Administratif'}
          description={
            t('label-administrativeDesc') ||
            'Numéro de sécurité sociale et dates'
          }
          icon={<IdCard size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <Input
              name="nsifNumber"
              control={control}
              label={t('label-nsifNumber')}
              prepend={<FileText size={16} />}
              className="w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <DatePicker
                name="hireDate"
                control={control}
                label={t('label-hireDate')}
                className="w-full"
              />

              <DatePicker
                name="terminationDate"
                control={control}
                label={t('label-terminationDate')}
                className="w-full"
              />
            </div>
          </div>
        </FormSection>

        {/* Employment Type & Status Section */}
        <FormSection
          title={t('label-contract') || 'Contrat'}
          description={t('label-contractDesc') || "Statut et type d'emploi"}
          icon={<Briefcase size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-3">
            <Input
              name="employmentStatus"
              control={control}
              label={t('label-employmentStatus')}
              className="w-full"
              type="select"
              required
              prepend={<CheckCircle size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="ACTIVE">{t('label-active')}</option>
              <option value="SUSPENDED">{t('label-suspended')}</option>
              <option value="TERMINATED">{t('label-terminated')}</option>
              <option value="RETIRED">{t('label-retired')}</option>
              <option value="ON_LEAVE">{t('label-onLeave')}</option>
            </Input>

            <Input
              name="employmentType"
              control={control}
              label={t('label-employmentType')}
              className="w-full"
              type="select"
              required
              prepend={<FileText size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="FULL_TIME">{t('label-fullTime')}</option>
              <option value="PART_TIME">{t('label-partTime')}</option>
              <option value="CONTRACT">{t('label-contract')}</option>
              <option value="TEMPORARY">{t('label-temporary')}</option>
            </Input>
          </div>
        </FormSection>

        {/* Compensation Section */}
        <FormSection
          title={t('label-compensation') || 'Rémunération'}
          description={t('label-compensationDesc') || 'Type de paie et salaire'}
          icon={<DollarSign size={18} />}
          color="#ea5455"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <Input
              name="payType"
              control={control}
              label={t('label-payType')}
              className="w-full"
              type="select"
              required
              prepend={<DollarSign size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="SALARY">{t('SALARY')}</option>
              <option value="HOURLY">{t('HOURLY')}</option>
            </Input>

            <div className="w-full">
              {watch('payType') === 'SALARY' && (
                <NumericInput
                  name="baseSalary"
                  nameF="baseSalaryF"
                  control={control}
                  setValue={setValue}
                  label={t('label-baseSalary')}
                  prepend={<DollarSign size={16} />}
                />
              )}

              {watch('payType') === 'HOURLY' && (
                <NumericInput
                  name="hourlySalary"
                  nameF="hourlySalaryF"
                  control={control}
                  setValue={setValue}
                  label={t('label-hourlySalary')}
                  prepend={<DollarSign size={16} />}
                />
              )}
            </div>
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default EmployeeForm

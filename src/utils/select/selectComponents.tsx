import { components } from 'react-select'
import DetailedComboboxItem from '@/@core/components/ui/detailed-combobox-item'
import ComboboxItem from '@/@core/components/ui/combobox-item'
import { concat } from '@/utils/helpers'
import dayjs from 'dayjs'

export const departmentOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={props.data.school ? props.data.school.name : ''}
      category={props.data.schoolSection ? props.data.schoolSection.name : ''}
      sku={props.data.code}
    />
  </components.Option>
)

export const schoolYearOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem
      name={props.data.label}
      description={props.data.school ? props.data.school.name : ''}
    />
  </components.Option>
)

export const schoolSectionOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem
      name={props.data.name}
      description={props.data.language ? props.data.language.name : ''}
    />
  </components.Option>
)

export const timeSlotOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem
      name={props.data.name}
      description={`${props.data.startTime} - ${props.data.endTime}`}
    />
  </components.Option>
)

export const periodOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem
      name={props.data.label}
      description={props.data.period ? props.data.period.label : ''}
    />
  </components.Option>
)

export const levelOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={''}
      category={props.data.cycle ? props.data.cycle.name : ''}
      sku={props.data.cycle ? props.data.cycle.schoolYear.label : ''}
    />
  </components.Option>
)

export const branchOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={''}
      category={props.data.level ? props.data.level.name : ''}
      sku={props.data.level ? props.data.level.cycle.schoolYear.label : ''}
    />
  </components.Option>
)

export const classOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={props.data.branch ? props.data.branch.level.name : ''}
      category={props.data.branch ? props.data.branch.name : ''}
      sku={
        props.data.branch ? props.data.branch.level.cycle.schoolYear.label : ''
      }
    />
  </components.Option>
)

export const cycleOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={props.data.name2}
      category={props.data.schoolSection ? props.data.schoolSection.name : ''}
      sku={props.data.schoolYear ? props.data.schoolYear.label : ''}
    />
  </components.Option>
)

export const subPeriodOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem
      name={props.data.label}
      description={props.data.period ? props.data.period.label : ''}
    />
  </components.Option>
)

export const decisionOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={''}
      category={props.data.code}
      sku={props.data.note}
    />
  </components.Option>
)

export const studentOptions = (props: any) => {
  return (
    <components.Option {...props}>
      <DetailedComboboxItem
        name={
          props.data.firstName
            ? props.data.lastName + ' ' + props.data.firstName
            : props.data.lastName
        }
        description={props.data.birthplace}
        category={props.data.birthDate}
        sku={props.data.registrationNumber}
      />
    </components.Option>
  )
}

export const teacherOptions = (props: any) => {
  return (
    <components.Option {...props}>
      <DetailedComboboxItem
        name={concat(props.data.lastName, props.data.firstName)}
        description={props.data.currentPost}
        category={props.data.rank}
        sku={props.data.registrationNumber}
      />
    </components.Option>
  )
}

export const teacherSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    {props.data.registrationNumber
      ? props.data.registrationNumber +
        ' ' +
        concat(props.data.lastName, props.data.firstName)
      : concat(props.data.lastName, props.data.firstName)}
  </components.SingleValue>
)

export const teacherFilterOptions = (option: any, searchText: string) => {
  const fullName = option.data.firstName
    ? option.data.lastName + ' ' + option.data.firstName
    : option.data.lastName

  return (
    option.data.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    (option.data.firstName &&
      fullName.toLowerCase().includes(searchText.toLowerCase())) ||
    (option.data.registrationNumber &&
      option.data.registrationNumber
        .toLowerCase()
        .includes(searchText.toLowerCase()))
  )
}

export const accountOptions = (props: any) => {
  return (
    <components.Option {...props}>
      <DetailedComboboxItem
        name={
          props.data.number ? props.data.number + ' ' + props.data.name : ''
        }
        description={props.data.parent ? props.data.parent.name : ''}
        category={
          props.data.accountCategory ? props.data.accountCategory.name : ''
        }
        sku={props.data.accountGroup ? props.data.accountGroup.name : ''}
      />
    </components.Option>
  )
}

export const accountCategoryOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem name={props.data.name} description={props.data.accountType} />
  </components.Option>
)

export const accountGroupOptions = (props: any) => (
  <components.Option {...props}>
    <ComboboxItem name={props.data.name} description={props.data.sectionType} />
  </components.Option>
)

export const accountFilterOptions = (option: any, searchText: string) => {
  return (
    option.data.name.toLowerCase().includes(searchText.toLowerCase()) ||
    // option.data.firstName && fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    (option.data.number &&
      option.data.number.toLowerCase().includes(searchText.toLowerCase()))
  )
}

export const personOptions = (props: any) => {
  return (
    <components.Option {...props}>
      <ComboboxItem
        name={concat(props.data.lastName, props.data.firstName)}
        description={props.data.__typename}
      />
    </components.Option>
  )
}

export const subCompetenceOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.name}
      description={''}
      category={props.data.competence ? props.data.competence.name : ''}
      sku={`${props.data.competence.numberOrder}${props.data.code}`}
    />
  </components.Option>
)

export const accountSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    {props.data.number
      ? props.data.number + ' ' + props.data.name
      : props.data.name}
  </components.SingleValue>
)

export const personSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    {concat(props.data.lastName, props.data.firstName)}
  </components.SingleValue>
)

export const payrollPeriodOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={
        dayjs(props.data.startDate).format('DD/MM/YYYY') +
        ' - ' +
        dayjs(props.data.endDate).format('DD/MM/YYYY')
      }
      description={''}
      category={''}
      sku={dayjs(props.data.startDate).format('MMMM YYYY')}
    />
  </components.Option>
)

export const payrollPeriodSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    {dayjs(props.data.startDate).format('MMMM YYYY')}
  </components.SingleValue>
)

export const voucherOptions = (props: any) => (
  <components.Option {...props}>
    <DetailedComboboxItem
      name={props.data.number}
      description={''}
      category={''}
      sku={
        'Valeur disponible : ' +
        (Number(props.data.amount) - Number(props.data.usedAmount)).toString()
      }
    />
  </components.Option>
)

export const employeeOptions = (props: any) => {
  return (
    <components.Option {...props}>
      <ComboboxItem
        name={concat(
          props.data.personnel.lastName,
          props.data.personnel.firstName,
        )}
        description={props.data.__typename}
      />
    </components.Option>
  )
}

export const employeeSingleValue = (props: any) => {
  // console.log(props);
  return (
    <components.SingleValue {...props}>
      {concat(
        props.data?.personnel?.lastName,
        props.data?.personnel?.firstName,
      )}
    </components.SingleValue>
  )
}

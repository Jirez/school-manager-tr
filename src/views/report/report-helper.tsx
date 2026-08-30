import Select from '@/@core/components/select'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ReportPeriodOption {
  id: string
  label: string
  value: [Date, Date] | null
}

const periodOptions: ReportPeriodOption[] = [
  //{ id: "1", label: "label-allDates", value: null },
  {
    id: '2',
    label: 'label-today',
    value: [dayjs().toDate(), dayjs().toDate()],
  },
  {
    id: '3',
    label: 'label-thisWeek',
    value: [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()],
  },
  {
    id: '4',
    label: 'label-thisWeekToDate',
    value: [dayjs().startOf('week').toDate(), dayjs().toDate()],
  },
  {
    id: '5',
    label: 'label-thisMonth',
    value: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
  },
  {
    id: '6',
    label: 'label-thisMonthToDate',
    value: [dayjs().startOf('month').toDate(), dayjs().toDate()],
  },
  {
    id: '7',
    label: 'label-thisQuarter',
    value: [
      dayjs().startOf('month').toDate(),
      dayjs().endOf('month').add(59, 'days').toDate(),
    ],
  },
  {
    id: '8',
    label: 'label-thisQuarterToDate',
    value: [dayjs().startOf('month').toDate(), dayjs().toDate()],
  },
  {
    id: '9',
    label: 'label-thisYear',
    value: [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()],
  },
  {
    id: '10',
    label: 'label-thisYearToDate',
    value: [dayjs().startOf('year').toDate(), dayjs().toDate()],
  },
  {
    id: '11',
    label: 'label-yesterday',
    value: [dayjs().add(-1, 'days').toDate(), dayjs().add(-1, 'days').toDate()],
  },
  {
    id: '12',
    label: 'label-recent',
    value: [dayjs().add(-5, 'days').toDate(), dayjs().toDate()],
  },
  {
    id: '13',
    label: 'label-lastWeek',
    value: [
      dayjs().startOf('week').add(-7, 'days').toDate(),
      dayjs().endOf('week').add(-7, 'days').toDate(),
    ],
  },
  {
    id: '14',
    label: 'label-lastWeekToDate',
    value: [dayjs().startOf('week').add(-7, 'days').toDate(), dayjs().toDate()],
  },
  {
    id: '15',
    label: 'label-lastMonth',
    value: [
      dayjs().startOf('month').add(-1, 'month').toDate(),
      dayjs().endOf('month').add(-1, 'month').toDate(),
    ],
  },
  {
    id: '16',
    label: 'label-lastMonthToDate',
    value: [
      dayjs().startOf('month').add(-1, 'month').toDate(),
      dayjs().toDate(),
    ],
  },
  {
    id: '17',
    label: 'label-lastYear',
    value: [
      dayjs().startOf('year').add(-1, 'year').toDate(),
      dayjs().endOf('year').add(-1, 'year').toDate(),
    ],
  },
  {
    id: '18',
    label: 'label-lastYearToDate',
    value: [dayjs().startOf('year').add(-1, 'year').toDate(), dayjs().toDate()],
  },
  {
    id: '19',
    label: 'label-since30Days',
    value: [
      dayjs().add(-30, 'days').toDate(),
      dayjs().add(-30, 'days').toDate(),
    ],
  },
]

interface Props {
  methods: UseFormReturn<any, any>
}

const PeriodSelect: React.FC<Props> = ({ methods }) => {
  const { t } = useTranslation()
  const options = useMemo(() => {
    return periodOptions
  }, [])

  const onChange = (val: any) => {
    //console.log(val.value)
    methods.setValue('period', val.value)
  }

  return (
    <Select
      name="periodH"
      onChange={onChange}
      options={options}
      getOptionLabel={(option: any) => t(option.label)}
      getOptionValue={(option: any) => option.value}
      placeholder={t('label-selectPeriod')}
      className="w-full"
      isClearable
    />
  )
}

export default PeriodSelect

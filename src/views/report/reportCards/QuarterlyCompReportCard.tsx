import { useState } from 'react'
import { components } from 'react-select'
import dayjs from 'dayjs'
import { Image, Printer, FileText } from 'lucide-react'
import styled from 'styled-components'

import ReportOptions from '../ReportOptions'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import UncontrolledDatePicker from '@/@core/components/ui/uncontrolled-date-picker'
import PageHeader from '@/@core/components/ui/page-header'
import { studentOptions } from '@/utils/select/selectComponents'
import {
  CheckboxIcon,
  CheckboxInput,
  CheckboxLabel,
  PdfContainer,
} from '../report.style'
import {
  useClassesWithPeriodReportCardQuery,
  usePeriodsQuery,
  useStudentsByClassQuery,
} from '@/gql/graphql'

const CompactFilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(115, 103, 240, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.2);
  }
`

const CompactCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(115, 103, 240, 0.03);
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: rgba(115, 103, 240, 0.06);
    border-color: rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.08);
    border-color: rgba(115, 103, 240, 0.2);

    &:hover {
      background: rgba(115, 103, 240, 0.12);
    }
  }
`

const CompactOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const CompactSectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #7367f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .dark-layout & {
    color: #9e95f5;
  }
`

const CompactDatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.375rem;

    .dark-layout & {
      color: #9ca3af;
    }
  }
`

const CompactSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

const CompactLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #9ca3af;
  text-align: center;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 0.75rem;
    opacity: 0.5;
    color: #7367f0;
  }

  p {
    font-size: 0.85rem;
    margin: 0;
  }

  .dark-layout & {
    color: #6b7280;
  }
`

const QuarterlyCompReportCard = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    background: false,
    simplified: false,
    apc: true,
    printingDate: dayjs().toDate(),
    model: { label: 'Modèle 1', value: 1 },
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesWithPeriodReportCardQuery({
    variables: {
      period: values.period ? (Number(values.period.id) as any) : null,
    },
    skip: !values.period,
    fetchPolicy: 'network-only',
  })

  const { data: dataPeriod, loading: loadingPeriod } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataStudent, loading: loadingStudent } =
    useStudentsByClassQuery({
      variables: { id: values.clazz ? Number(values.clazz.id) : -1 },
      skip: !values.clazz,
      fetchPolicy: 'network-only',
    })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, period: event }))
  }

  const onStudentFilterChange = (event: any) => {
    setValues((val) => ({ ...val, student: event }))
  }

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.registrationNumber +
        ' ' +
        props.data.lastName +
        ' ' +
        (props.data.firstName ? props.data.firstName : '')}
    </components.SingleValue>
  )

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.quarterlyCompReport')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <CompactFilterSection>
          <Select
            onChange={onPeriodFilterChange}
            options={dataPeriod?.periods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectPeriod')}
            isLoading={loadingPeriod}
          />

          {values.period && (
            <Select
              onChange={onClassFilterChange}
              options={
                data?.classes?.filter((c: any) => c.competenceClass) || []
              }
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectClass')}
              isLoading={loading}
            />
          )}

          {values.clazz && (
            <Select
              onChange={onStudentFilterChange}
              options={dataStudent?.students || undefined}
              getOptionLabel={(option: any) => option.lastName}
              getOptionValue={(option: any) => option.id}
              components={{ Option: studentOptions, SingleValue }}
              placeholder={t('label-selectStudent')}
              isLoading={loadingStudent}
            />
          )}
        </CompactFilterSection>

        <div>
          <CompactOptionsGrid>
            <CompactSelectWrapper>
              <CompactLabelWrapper>
                <FileText size={14} />
                Modèle
              </CompactLabelWrapper>
              <Select
                onChange={(event: any) =>
                  setValues((val) => ({ ...val, model: event }))
                }
                options={[
                  { label: 'Modèle 1', value: 1 },
                  { label: 'Modèle 2', value: 2 },
                ]}
                placeholder={t('label-selectModel')}
                value={values.model}
              />
            </CompactSelectWrapper>

            <CompactCheckboxItem>
              <CheckboxInput
                checked={values.background}
                onChange={(e) =>
                  setValues((val) => ({
                    ...val,
                    background: e.target.checked,
                  }))
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <Image size={16} />
                </CheckboxIcon>
                {t('label-withBackground')}
              </CheckboxLabel>
            </CompactCheckboxItem>

            <CompactDatePickerWrapper>
              <label>
                <Printer size={14} />
                Date d'impression
              </label>
              <UncontrolledDatePicker
                onChange={(val) =>
                  setValues((old) => ({ ...old, printingDate: val }))
                }
                value={values.printingDate}
              />
            </CompactDatePickerWrapper>
          </CompactOptionsGrid>
        </div>
      </ReportOptions>

      <PdfContainer>
        {values.clazz && values.period && values.model.value ? (
          <PdfViewer
            url={`reports/quarterly-comp-report-${enterpriseId}-${
              values.period.id
            }.pdf?search=clazz:${values.clazz.id},period:${values.period.id}${
              values.student ? `,student:${values.student.id}` : ''
            }&background=${values.background}&simplified=${
              values.simplified
            }&apc=${values.apc}&sort=BY_MERIT&printingDate=${dayjs(
              values.printingDate,
            ).format('DD/MM/YYYY')}&model=${values.model.value}`}
          />
        ) : (
          <CompactEmptyState>
            <FileText />
            <p>
              {t('label-selectPeriodClassAndModelToView') ||
                'Sélectionnez une période, une classe et un modèle pour voir le bulletin trimestriel de compétences'}
            </p>
          </CompactEmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default QuarterlyCompReportCard

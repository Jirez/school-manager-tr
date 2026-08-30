import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'reactstrap'
import { useDebounce } from 'ahooks'
import { Image, Printer, FileText, Award } from 'lucide-react'
import { styled } from 'styled-components'

import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useClassesForNoteQuery, usePeriodsQuery } from '@/gql/graphql'
import dayjs from 'dayjs'
import UncontrolledDatePicker from '@/@core/components/ui/uncontrolled-date-picker'
import ReportOptions from '../ReportOptions'
import {
  CheckboxIcon,
  CheckboxInput,
  CheckboxItem,
  CheckboxLabel,
  DatePickerWrapper,
  FilterSection,
  OptionsGrid,
  SectionTitle,
  PdfContainer,
  EmptyState,
} from '../report.style'

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .dark-layout & {
      color: #9ca3af;
    }
  }

  input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgba(115, 103, 240, 0.2);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background: #ffffff;

    &:focus {
      outline: none;
      border-color: #7367f0;
      box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
    }

    .dark-layout & {
      background: #283046;
      border-color: rgba(115, 103, 240, 0.3);
      color: #e4e6eb;

      &:focus {
        border-color: #7367f0;
      }
    }
  }
`

const QuarterlyHonorRoll = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    nth: '12',
    background: false,
    printingDate: dayjs().toDate(),
  })
  const debouncedValue = useDebounce(values.nth, { wait: 1000 })
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataClass,
    loading,
    subscribeToMore,
  } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const onPeriodFilterChange = (event: any) => {
    setValues({ ...values, period: event })
  }

  const onClassFilterChange = (event: any) => {
    setValues({ ...values, clazz: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-quarterlyHonorRoll')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        {/* Filters Section */}
        <FilterSection>
          <Select
            onChange={onPeriodFilterChange}
            options={data?.periods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder="Sélectionner une période"
          />

          <Select
            onChange={onClassFilterChange}
            options={dataClass?.clazzes || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder="Sélectionner une classe"
            isLoading={loading}
          />
        </FilterSection>

        {/* Report Options Section */}
        <div>
          <SectionTitle>
            <FileText size={16} />
            Options du rapport
          </SectionTitle>
          <OptionsGrid>
            <InputWrapper>
              <label>
                <Award size={16} />
                Moyenne supérieure ou égale à:
              </label>
              <Input
                onChange={(val) =>
                  setValues({ ...values, nth: val.target.value })
                }
                value={values.nth}
                placeholder="Ex: 12"
              />
            </InputWrapper>

            <DatePickerWrapper>
              <label>
                <Printer size={16} />
                Date d'impression
              </label>
              <UncontrolledDatePicker
                onChange={(val) =>
                  setValues((old) => ({ ...old, printingDate: val }))
                }
                value={values.printingDate}
              />
            </DatePickerWrapper>

            <CheckboxItem>
              <CheckboxInput
                id="background"
                checked={values.background}
                onChange={(e) =>
                  setValues({ ...values, background: e.target.checked })
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <Image size={18} />
                </CheckboxIcon>
                {t('label-withBackground')}
              </CheckboxLabel>
            </CheckboxItem>
          </OptionsGrid>
        </div>
      </ReportOptions>
      <PdfContainer>
        {values.period && debouncedValue ? (
          <PdfViewer
            url={`reports/quarterly-honor-roll-${enterpriseId}-${
              values.period.id
            }.pdf?minAverage=${debouncedValue}${
              values.clazz ? `&clazzId=${values.clazz.id}` : ''
            }&printingDate=${dayjs(values.printingDate).format(
              'DD/MM/YYYY',
            )}&withBackground=${
              values.background
            }&params=columnBorder:true,rowNumber:true,title:Liste des ${debouncedValue} premiers trimestriel`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectPeriodAndAverageToView') ||
                "Sélectionnez une période et entrez une moyenne pour voir le tableau d'honneur trimestriel"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default QuarterlyHonorRoll

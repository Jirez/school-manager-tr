import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import styled from 'styled-components'
import { Users, Play, Settings2, ShieldCheck } from 'lucide-react'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import ReportOptions from '../ReportOptions'
import PdfViewer from '@/utils/PdfViewer'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Button from '@/@core/components/button'
import { buildOptions } from '@/utils/helpers'
import CustomReportModal from '../CustomReportModal'
import { useModal } from '@ebay/nice-modal-react'
import { useSearch } from '../useReportSearch'
import { useEffect } from 'react'
import { useUsersQuery } from '@/gql/graphql'
import { PdfContainer } from '../report.style'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
`

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: flex-end;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
  }
`

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(115, 103, 240, 0.2);
`

// ... (Interface LoginHistoryReport)

const LoginHistoryReport = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const {
    setValues,
    params,
    show,
    onSubmit,
    values: currentValues,
  } = useSearch({
    title: t('sidebar.reports.loginHistoryReport'),
    columnBorder: true,
    orientation: 'PORTRAIT',
    rowNumber: true,
  })
  const modal = useModal(CustomReportModal)

  const { data } = useUsersQuery({
    variables: { id: enterpriseId },
  })

  const methods = useForm<any>({
    defaultValues: {
      period: dayjs().toDate(),
      category: null,
    },
  })

  const values = methods.watch()

  useEffect(() => {
    setValues((val) => ({ ...val, loading: false }))
  }, [methods.formState.touchedFields])

  return (
    <div className="flex flex-col w-full ">
      <PageHeader
        title={t('sidebar.reports.loginHistoryReport')}
        returnLink="/reports"
        icon={<ShieldCheck className="text-primary" />}
      />

      <ReportOptions title={t('sidebar.reports.loginHistoryReport')}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormContainer>
            <OptionsGrid>
              <div className="md:col-span-12 lg:col-span-5">
                <SimpleDatePicker
                  name="period"
                  control={methods.control}
                  label={t('label-period')}
                  options={{
                    dateFormat: 'd/m/Y',
                    mode: 'range',
                    allowInput: true,
                  }}
                />
              </div>

              <div className="md:col-span-12 lg:col-span-7">
                <ControlledSelect
                  name="category"
                  control={methods.control}
                  label={t('label-users')}
                  prepend={<Users size={16} />}
                  onChange={(val: any) => methods.setValue('category', val)}
                  options={data ? data.users : undefined}
                  getOptionLabel={(option: any) => option.username}
                  getOptionValue={(option: any) => option.id}
                  placeholder={t('label-selectUsers')}
                  isMulti
                />
              </div>
            </OptionsGrid>

            <ActionRow>
              <Button
                type="button"
                color="flat-secondary"
                size="sm"
                className="flex hover:bg-light-secondary rounded-full px-4"
                onClick={() =>
                  modal.show({ options: { ...currentValues }, setValues })
                }
              >
                <Settings2 size={14} className="me-2" />
                {t('label-customizeReport')}
              </Button>

              <Button
                type="submit"
                color="primary"
                className="flex h-[36px] shadow-lg shadow-primary/30 rounded-full px-6"
              >
                <Play size={14} className="me-2" />
                {t('label-executeReport')}
              </Button>
            </ActionRow>
          </FormContainer>
        </Form>
      </ReportOptions>

      {show && (
        <PdfContainer>
          <PdfViewer
            url={`reports/login-history-${enterpriseId}.pdf?search=enterprise:${enterpriseId}${
              values.category && values.category.length > 0
                ? `,user:${buildOptions(values.category)}`
                : ''
            },${currentValues.search}&params=${params}`}
          />
        </PdfContainer>
      )}
    </div>
  )
}

export default LoginHistoryReport

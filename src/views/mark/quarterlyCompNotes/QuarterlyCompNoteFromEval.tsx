import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import PageHeader from '@/@core/components/ui/page-header'
import { classOptions, periodOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  usePeriodsQuery,
  useQuarterlyCompNoteFromEvalQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'
import QuarterlyCompNoteAdd from './QuarterlyCompNoteAdd'

const QuarterlyCompNoteFromEval = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()
  const [period, setPeriod] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  useTitle(t('sidebar.marks.quarterlyNotes'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const {
    data: dataPeriod,
    loading: loadingPeriod,
    subscribeToMore: subscribeToMoreSubPeriod,
  } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSubject, loading: loadingSubject } =
    useSubjectsForNotesQuery({
      variables: { id: clazz ? Number(clazz.id) : -1 },
      skip: !clazz,
      fetchPolicy: 'network-only',
    })

  const {
    data: dataNote,
    loading: loadingNote,
    error,
  } = useQuarterlyCompNoteFromEvalQuery({
    variables: {
      classId: clazz ? Number(clazz.id) : -1,
      periodId: period ? Number(period.id) : -1,
      subjectId: subject ? Number(subject.id) : -1,
      schoolId: enterpriseId,
    },
    skip: !clazz || !period || !subject,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'quarterlyNote') {
          setSubject(null)
        }
      }
    })
  })

  //console.log(JSON.parse(localStorage.getItem(TokenStorage.authUserKey())!))

  return (
    <div className="flex flex-col w-full">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.quarterlyNotes')} />
        </div>

        <div className="flex flex-row space-x-5">
          <div className="w-4/12">
            <LiveView
              document={ClassCreatedDocument}
              singleVar="clazz"
              data={data}
              loading={loading}
              listVar="clazzes"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              showLoader={false}
            >
              {({ clazzes }) => (
                <Select
                  onChange={(val: any) => {
                    setClazz(val)
                    setSubject(null)
                  }}
                  options={clazzes || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  placeholder={t('label-selectClass')}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isLoading={loading}
                />
              )}
            </LiveView>
          </div>

          <div className="w-4/12">
            <LiveView
              document={PeriodCreatedDocument}
              singleVar="period"
              data={dataPeriod}
              loading={loadingPeriod}
              listVar="periods"
              subscribeToMore={subscribeToMoreSubPeriod}
              sortField="label"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              showLoader={false}
            >
              {({ periods }) => (
                <Select
                  onChange={(val: any) => setPeriod(val)}
                  options={periods || undefined}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.id}
                  value={period}
                  components={{ Option: periodOptions }}
                  placeholder={t('label-selectPeriod')}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isLoading={loadingPeriod}
                />
              )}
            </LiveView>
          </div>

          {clazz && (
            <div className="w-4/12">
              <Select
                value={subject}
                onChange={(val: any) => setSubject(val)}
                options={dataSubject?.subjects || undefined}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                placeholder={t('label-selectSubject')}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                isClearable
                isLoading={loadingSubject}
              />
            </div>
          )}
        </div>

        {!error ? (
          clazz &&
          period &&
          subject && (
            <div className="w-full">
              {loadingNote ? (
                <LoadingSpinner />
              ) : (
                <div className="card" style={{ marginTop: 20 }}>
                  <QuarterlyCompNoteAdd
                    quarterlyNotes={dataNote?.quarterlyCompNote}
                    classId={clazz.id}
                    periodId={period.id}
                    subjectId={subject.id}
                  />
                </div>
              )}
            </div>
          )
        ) : (
          <div className="w-full mt-4 flex justify-center items-end">
            <ErrorComponent
              message={
                "Vous n'êtes pas autorisé à éditer les notes de cette évaluation. Veuillez contacter votre fournisseur afin de renouveler votre licence."
              }
              title={t('label-invalidLicense')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default QuarterlyCompNoteFromEval

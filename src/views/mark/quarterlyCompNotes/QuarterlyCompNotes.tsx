import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingTable from '@/@core/components/ui/table/loading-table'
import PageHeader from '@/@core/components/ui/page-header'
import { classOptions, periodOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  useEvalCompBySubjectQuery,
  usePeriodsQuery,
  useQuarterlyCompNotesQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'
import QuarterlyCompNoteAdd from './QuarterlyCompNoteAdd'
import { m } from '@/paraglide/messages'
import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const QuarterlyCompNotes = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()
  const [period, setPeriod] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  useTitle(m['sidebar.marks.quarterlyCompNotes']())
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
    data: dataCompetence,
    loading: loadingCompetence,
    error: competenceError,
  } = useEvalCompBySubjectQuery({
    variables: {
      classId: clazz ? Number(clazz.id) : -1,
      periodId: period ? Number(period.id) : -1,
      subjectId: subject ? Number(subject.id) : -1,
    },
    skip: !clazz || !period || !subject,
    fetchPolicy: 'network-only',
  })

  const {
    data: dataNote,
    loading: loadingNote,
    error,
  } = useQuarterlyCompNotesQuery({
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

  const competences =
    dataCompetence?.competences
      ?.flatMap((competence) => competence.items)
      .sort((a, b) => a.numberOrder - b.numberOrder) ?? []

  return (
    <div className="flex flex-col w-full px- md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName" className="">
            {' '}
          </div>
          <PageHeader
            title={m.quarterlyCompNoteInput()}
            titleClassName="text-sm md:text-xl "
          />
        </div>

        <div className="flex flex-col md:flex-row gap-0.5">
          <div className="w-full md:w-4/12">
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
                  options={clazzes?.filter((c: any) => c.competenceClass) || []}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  placeholder={m['label_selectClass']()}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isLoading={loading}
                />
              )}
            </LiveView>
          </div>

          <div className="w-full md:w-4/12">
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
                  placeholder={m['label_selectPeriod']()}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isLoading={loadingPeriod}
                />
              )}
            </LiveView>
          </div>

          {clazz && (
            <div className="w-full md:w-4/12">
              <Select
                value={subject}
                onChange={(val: any) => setSubject(val)}
                options={dataSubject?.subjects || undefined}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                placeholder={m['label_selectSubject']()}
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
              <aside
                className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100"
                aria-label={m.label_competenceReminderTitle()}
              >
                <div className="mb-3 flex items-center gap-2 font-semibold">
                  <Info size={18} aria-hidden="true" />
                  <h2>{m.label_competenceReminderTitle()}</h2>
                </div>
                {competenceError ? (
                  <p role="alert">{m.label_competenceReminderError()}</p>
                ) : loadingCompetence ? (
                  <p>{m.label_competenceReminderLoading()}</p>
                ) : competences.length > 0 ? (
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {competences.map((competence) => (
                      <li
                        key={competence.id ?? competence.numberOrder}
                        className="rounded-md bg-white/70 p-2 dark:bg-slate-900/40"
                      >
                        <strong>
                          {m.label_competenceNumber({
                            no: competence.numberOrder,
                          })}
                          : :
                        </strong>{' '}
                        {competence.competence}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{m.label_competenceReminderEmpty()}</p>
                )}
              </aside>

              {loadingNote ? (
                <div style={{ marginTop: 20 }}>
                  <LoadingTable
                    rows={8}
                    columns={6}
                    showAvatar={false}
                    label={m.loading_notes()}
                  />
                </div>
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
              title={m['label_invalidLicense']()}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default QuarterlyCompNotes

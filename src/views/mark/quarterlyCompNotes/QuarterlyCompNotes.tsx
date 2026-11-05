import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingTable from '@/@core/components/ui/table/loading-table'
import PageHeader from '@/@core/components/ui/page-header'
import ContentSurface from '@/@core/components/ui/content-surface'
import SelectWrapper from '@/@core/components/ui/select-wrapper'
import PanelSectionHeading from '@/@core/components/ui/panel-section-heading'
import {
  classicOptions,
  classOptions,
  periodOptions,
} from '@/utils/select/selectComponents'
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
import { BookOpen, CalendarDays, CheckCircle2, Info, Users } from 'lucide-react'

const QuarterlyCompNotes = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()
  const [period, setPeriod] = useState<{ [key: string]: any }>()

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
    <div className="quarterly-comp-note-page flex w-full flex-col gap-3 px-0 sm:px-1 lg:px-0">
      <style>{`
        .dark-layout .quarterly-comp-note-page .quarterly-page-header {
          background: #283046 !important;
          border-color: #404656 !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-page-header h1 {
          color: #f8fafc !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-page-header p {
          color: #b4b7bd !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-surface {
          background: #283046 !important;
          border-color: #404656 !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-empty-state {
          background: rgb(40 48 70 / 0.55) !important;
          border-color: #404656 !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-heading {
          color: #f8fafc !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-copy,
        .dark-layout .quarterly-comp-note-page .quarterly-label {
          color: #b4b7bd !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-placeholder {
          border-color: #505767 !important;
          color: #8f93a2 !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-reminder {
          background: rgb(30 58 95 / 0.7) !important;
          border-color: #315b91 !important;
          color: #dbeafe !important;
        }
        .dark-layout .quarterly-comp-note-page .quarterly-reminder-item {
          background: rgb(40 48 70 / 0.82) !important;
          color: #dbeafe !important;
        }
      `}</style>
      <div>
        <div className="w-full">
          <div id="displayStudentName" className="" />
          <PageHeader
            title={m.quarterlyCompNoteInput()}
            subtitle="Saisissez les évaluations par compétence pour chaque élève."
            icon={<BookOpen size={20} />}
            titleClassName="text-base sm:text-xl"
            className="quarterly-page-header mb-0 min-h-[52px] px-2.5 sm:px-3"
          />
        </div>

        <ContentSurface
          as="section"
          className="quarterly-surface mt-1 p-1 sm:p-4"
        >
          <PanelSectionHeading
            icon={<CalendarDays size={18} aria-hidden="true" />}
            title="Paramètres de saisie"
            description="Choisissez une classe, une période et une matière pour afficher la grille."
          />
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            <SelectWrapper
              label={m.label_class()}
              icon={<Users size={14} aria-hidden="true" />}
              htmlFor="quarterly-class-select"
            >
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
                    options={
                      clazzes?.filter((c: any) => c.competenceClass) || []
                    }
                    inputId="quarterly-class-select"
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
            </SelectWrapper>

            <SelectWrapper
              label={m.label_period()}
              icon={<CalendarDays size={14} aria-hidden="true" />}
              htmlFor="quarterly-period-select"
            >
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
                    inputId="quarterly-period-select"
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
            </SelectWrapper>

            <SelectWrapper
              label={m.label_subject()}
              icon={<BookOpen size={14} aria-hidden="true" />}
              htmlFor="quarterly-subject-select"
            >
              {clazz ? (
                <Select
                  inputId="quarterly-subject-select"
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
                  components={{ Option: classicOptions }}
                />
              ) : (
                <div className="quarterly-placeholder flex min-h-[38px] items-center rounded-md border border-dashed border-slate-300 px-3 text-sm text-slate-400 dark:border-slate-600 dark:text-slate-500">
                  {m.select_class_before()}
                </div>
              )}
            </SelectWrapper>
          </div>
        </ContentSurface>

        {!clazz || !period || !subject ? (
          <section className="quarterly-empty-state mt-1 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-800/50 sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 size={24} aria-hidden="true" />
            </div>
            <h2 className="quarterly-heading mt-3 text-base font-semibold text-slate-800 dark:text-white sm:text-lg">
              Votre grille est presque prête
            </h2>
            <p className="quarterly-copy mx-auto mt-1.5 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Complétez les trois filtres ci-dessus pour charger les élèves et
              les compétences à évaluer.
            </p>
          </section>
        ) : null}
      </div>

      {!error ? (
        clazz &&
        period &&
        subject && (
          <div className="w-full space-y-3 ">
            <aside
              className="quarterly-reminder -mt-8 rounded-xl border border-blue-200 bg-blue-50/80 p-2 text-blue-900 shadow-sm dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-100 sm:p-2"
              aria-label={m.label_competenceReminderTitle()}
            >
              <div className="mb-2.5 flex items-center gap-1 font-semibold">
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
                      className="quarterly-reminder-item rounded-md bg-white/70 p-2 dark:bg-slate-900/40"
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
              <div>
                <LoadingTable
                  rows={8}
                  columns={6}
                  showAvatar={false}
                  label={m.loading_notes()}
                />
              </div>
            ) : (
              <div className="quarterly-surface overflow-hidden">
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
  )
}

export default QuarterlyCompNotes

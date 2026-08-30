import { useEffect } from 'react'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import PageHeader from '@/@core/components/ui/page-header'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  useEvalCompBySubjectQuery,
  usePeriodsQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'
import EvalCompSubjectAdd from './EvalCompSubjectAdd'
import { selectThemeColors } from '@/utils/Utils'
import { GraduationCap, Calendar, BookOpen, Target } from 'lucide-react'
import {
  ContentCard,
  EmptyStateCard,
  LabelWrapper,
  LoadingCard,
  SelectGrid,
  SelectionCard,
  SelectWrapper,
} from '@/@core/components/ui/forms/form.style'

const EvalCompSubject = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.evaluatedCompetences'))
  const { enterpriseId } = useAuthentication()

  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)
  const [period, setPeriod] = useState<{ [key: string]: any } | null>(null)
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataPeriod,
    loading: loadingPeriod,
    subscribeToMore: subscribeToMorePeriod,
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

  const { data: dataCompetence, loading: loadingCompetence } =
    useEvalCompBySubjectQuery({
      variables: {
        classId: clazz ? Number(clazz.id) : -1,
        periodId: period ? Number(period.id) : -1,
        subjectId: subject ? Number(subject.id) : -1,
      },
      skip: !clazz || !period || !subject,
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'expectedCompetence') {
          setPeriod(null)
          setClazz(null)
          setSubject(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full">
        <div id="displayStudentName" className="hidden" />
        <PageHeader title={t('sidebar.marks.expectedCompetences')} />
      </div>

      <SelectionCard>
        <SelectGrid>
          <SelectWrapper>
            <LabelWrapper>
              <GraduationCap size={18} />
              <label>{t('label-class')}</label>
            </LabelWrapper>
            <LiveView
              document={ClassCreatedDocument}
              singleVar="clazz"
              data={data}
              listVar="clazzes"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              loading={loading}
            >
              {({ clazzes }) => (
                <Select
                  onChange={(val) => {
                    setClazz(val)
                  }}
                  options={clazzes?.filter((c: any) => c.competenceClass) || []}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  placeholder={t('label-selectClass')}
                />
              )}
            </LiveView>
          </SelectWrapper>

          <SelectWrapper>
            <LabelWrapper>
              <Calendar size={18} />
              <label>{t('label-period')}</label>
            </LabelWrapper>
            <LiveView
              document={PeriodCreatedDocument}
              singleVar="period"
              data={dataPeriod}
              listVar="periods"
              subscribeToMore={subscribeToMorePeriod}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              loading={loadingPeriod}
            >
              {({ periods }) => (
                <Select
                  onChange={(val) => setPeriod(val)}
                  options={periods || undefined}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.id}
                  value={period}
                  components={{ Option: subPeriodOptions }}
                  placeholder={t('label-selectPeriod')}
                />
              )}
            </LiveView>
          </SelectWrapper>

          {clazz && (
            <SelectWrapper>
              <LabelWrapper>
                <BookOpen size={18} />
                <label>{t('label-subject')}</label>
              </LabelWrapper>
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
            </SelectWrapper>
          )}
        </SelectGrid>
      </SelectionCard>

      {clazz && period && subject ? (
        loadingCompetence ? (
          <LoadingCard>
            <LoadingSpinner />
          </LoadingCard>
        ) : (
          <ContentCard>
            <EvalCompSubjectAdd
              competences={dataCompetence?.competences}
              classId={clazz.id}
              period={period.id}
            />
          </ContentCard>
        )
      ) : (
        <EmptyStateCard>
          <Target
            size={48}
            className="mx-auto mb-4"
            style={{
              color: '#a855f7',
              filter: 'drop-shadow(0 4px 6px rgba(168, 85, 247, 0.3))',
            }}
          />
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.9375rem',
              fontWeight: 500,
            }}
            className="dark:text-gray-400"
          >
            {t('label-selectFiltersToViewCompetences') ||
              'Sélectionnez une classe, un trimestre et une matière pour afficher les compétences'}
          </p>
        </EmptyStateCard>
      )}
    </div>
  )
}

export default EvalCompSubject

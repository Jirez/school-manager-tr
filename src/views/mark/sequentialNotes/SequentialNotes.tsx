import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import SequentialNoteAdd from '@/views/mark/sequentialNotes/SequentialNoteAdd'
import PageHeader from '@/@core/components/ui/page-header'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesForNoteQuery,
  useSequentialNotesQuery,
  useSubPeriodsQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'

const SequentialNotes = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()
  const [subPeriod, setSubPeriod] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  useTitle(t('sidebar.marks.sequentialNotes'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const {
    data: dataSubPeriod,
    loading: loadingSubPeriod,
    subscribeToMore: subscribeToMoreSubPeriod,
  } = useSubPeriodsQuery({
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
  } = useSequentialNotesQuery({
    variables: {
      classId: clazz ? (Number(clazz.id) as any) : null,
      subPeriodId: subPeriod ? (Number(subPeriod.id) as any) : null,
      subjectId: subject ? Number(subject.id) : -1,
      schoolId: enterpriseId,
    },
    skip: !clazz || !subPeriod || !subject,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'sequentialNote') {
          setSubject(null)
        }
      }
    })
  })

  /* if (error) {
        return <ErrorComponent message={error.message} />
    } */

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full">
        <div id="displayStudentName"> </div>
        <PageHeader title={t('sidebar.marks.sequentialNotes')} />
      </div>

      <div className="flex flex-col md:flex-row gap-0.5">
        <div className="w-full md:w-4/12">
          <LiveView
            document={ClassCreatedDocument}
            singleVar="clazz"
            data={data}
            //loading={loading}
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
                options={clazzes?.filter((c: any) => !c.competenceClass) || []}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
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

        <div className="w-full md:w-4/12">
          <LiveView
            document={SubPeriodCreatedDocument}
            singleVar="subPeriod"
            data={dataSubPeriod}
            //loading={loadingSubPeriod}
            listVar="subPeriods"
            subscribeToMore={subscribeToMoreSubPeriod}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
            showLoader={false}
          >
            {({ subPeriods }) => (
              <Select
                onChange={(val: any) => setSubPeriod(val)}
                options={subPeriods || undefined}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
                value={subPeriod}
                components={{ Option: subPeriodOptions }}
                placeholder="Sélectionnez une séquence"
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                isLoading={loadingSubPeriod}
              />
            )}
          </LiveView>
        </div>

        {clazz && (
          <div className="w-full md:w-4/12">
            <Select
              value={subject}
              onChange={(val) => setSubject(val)}
              options={dataSubject?.subjects || undefined}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
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
        subPeriod &&
        subject && (
          <div className="w-full">
            {loadingNote ? (
              <LoadingSpinner />
            ) : (
              <div className="card" style={{ marginTop: 20 }}>
                <SequentialNoteAdd
                  sequentialNotes={dataNote?.sequentialNotes}
                  classId={clazz.id}
                  subPeriodId={subPeriod.id}
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
  )
}

export default SequentialNotes

import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import PageHeader from '@/@core/components/ui/page-header'
import {
  classOptions,
  subPeriodOptions,
  subCompetenceOptions,
} from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesForNoteQuery,
  usePSequentialNoteQuery,
  useSubCompetencesByClassQuery,
  useSubPeriodsQuery,
} from '@/gql/graphql'
import PSequentialNoteAdd from './PSequentialNoteAdd'

const PSequentialNotes = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subCompetence, setSubCompetence] = useState<{
    [key: string]: any
  } | null>()
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
    useSubCompetencesByClassQuery({
      variables: { classId: clazz ? Number(clazz.id) : -1 },
      skip: !clazz,
      fetchPolicy: 'network-only',
    })

  const {
    data: dataNote,
    loading: loadingNote,
    error,
  } = usePSequentialNoteQuery({
    variables: {
      classId: clazz ? (Number(clazz.id) as any) : null,
      subPeriodId: subPeriod ? (Number(subPeriod.id) as any) : null,
      subCompetenceId: subCompetence ? Number(subCompetence.id) : -1,
      schoolId: enterpriseId,
    },
    skip: !clazz || !subPeriod || !subCompetence,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'pSequentialNote') {
          setSubCompetence(null)
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
                  setSubCompetence(null)
                }}
                options={clazzes || undefined}
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
              value={subCompetence}
              onChange={(val) => setSubCompetence(val)}
              options={dataSubject?.subCompetencesByClass || undefined}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholder={t('label-selectSubCompetence')}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              isClearable
              isLoading={loadingSubject}
              components={{ Option: subCompetenceOptions }}
            />
          </div>
        )}
      </div>

      {!error ? (
        clazz &&
        subPeriod &&
        subCompetence && (
          <div className="w-full">
            {loadingNote ? (
              <LoadingSpinner />
            ) : (
              <div className="card" style={{ marginTop: 20 }}>
                <PSequentialNoteAdd
                  sequentialNotes={dataNote?.sequentialNotes}
                  classId={clazz.id}
                  subPeriodId={subPeriod.id}
                  subCompetenceId={subCompetence.id}
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

export default PSequentialNotes

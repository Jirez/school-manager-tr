import { useState, useEffect } from 'react'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import { useTranslation } from 'react-i18next'
import SequentialNoteAdd from './SequentialNoteAdd'
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
import { useTitle } from 'ahooks'

const SequentialNoteCopy = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.copy'))
  const { enterpriseId } = useAuthentication()
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)
  const [subject, setSubject] = useState<{ [key: string]: any } | null>(null)
  const [subPeriod, setSubPeriod] = useState<{ [key: string]: any } | null>(
    null,
  )
  const [subjectDest, setSubjectDest] = useState<{
    [key: string]: any
  } | null>(null)
  const [subPeriodDest, setSubPeriodDest] = useState<{
    [key: string]: any
  } | null>(null)

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataSubPeriod,
    loading: loadingSubPeriod,
    subscribeToMore: subscribeToMoreSubPeriod,
  } = useSubPeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSubject } = useSubjectsForNotesQuery({
    variables: { id: clazz ? Number(clazz.id) : -1 },
    skip: !clazz,
  })

  const {
    data: dataNote,
    loading: loadingNote,
    error,
  } = useSequentialNotesQuery({
    variables: {
      classId: clazz ? (Number(clazz.id) as any) : null,
      subPeriodId: subPeriod ? (Number(subPeriod.id) as any) : null,
      subjectId: subject ? (Number(subject.id) as any) : null,
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
          setSubjectDest(null)
          setSubPeriod(null)
          setSubPeriodDest(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.sequentialNotes')} />
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="w-full md:w-2/12">
              <LiveView
                document={ClassCreatedDocument}
                singleVar="clazz"
                data={data}
                listVar="clazzes"
                subscribeToMore={subscribeToMore}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ clazzes }) => (
                  <Select
                    onChange={(val) => {
                      setClazz(val)
                      setSubject(null)
                    }}
                    options={
                      clazzes?.filter((c: any) => !c.competenceClass) || []
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={clazz}
                    components={{ Option: classOptions }}
                    //form={<AddClass/>}
                    placeholder="Sélectionnez une classe"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
                  />
                )}
              </LiveView>
            </div>

            <div className="w-full md:w-2/12">
              <LiveView
                document={SubPeriodCreatedDocument}
                singleVar="subPeriod"
                data={dataSubPeriod}
                listVar="subPeriods"
                subscribeToMore={subscribeToMoreSubPeriod}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ subPeriods }) => (
                  <Select
                    onChange={(val) => setSubPeriod(val)}
                    options={subPeriods || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={subPeriod}
                    components={{
                      Option: subPeriodOptions,
                    }}
                    //form={<AddClass/>}
                    placeholder="Séquence source"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
                  />
                )}
              </LiveView>
            </div>

            {clazz && (
              <div className="w-full md:w-2/12">
                <Select
                  value={subject}
                  onChange={(val) => setSubject(val)}
                  options={dataSubject?.subjects || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Matière source"
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isClearable
                />
              </div>
            )}

            <div className="w-full md:w-2/12">
              <LiveView
                document={SubPeriodCreatedDocument}
                singleVar="subPeriod"
                data={dataSubPeriod}
                listVar="subPeriods"
                subscribeToMore={subscribeToMoreSubPeriod}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ subPeriods }) => (
                  <Select
                    onChange={(val) => setSubPeriodDest(val)}
                    options={subPeriods || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={subPeriodDest}
                    components={{
                      Option: subPeriodOptions,
                    }}
                    //form={<AddClass/>}
                    placeholder="Séquence destination"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
                  />
                )}
              </LiveView>
            </div>

            {clazz && (
              <div className="w-full md:w-2/12">
                <Select
                  value={subjectDest}
                  onChange={(val) => setSubjectDest(val)}
                  options={dataSubject?.subjects || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Matière destination"
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isClearable
                />
              </div>
            )}
          </div>
        </div>

        {!error ? (
          clazz &&
          subPeriod &&
          subject &&
          subjectDest &&
          subPeriodDest && (
            <div className="w-full">
              {loadingNote ? (
                <LoadingSpinner />
              ) : (
                <div className="card" style={{ marginTop: 20 }}>
                  <SequentialNoteAdd
                    sequentialNotes={dataNote?.sequentialNotes}
                    classId={clazz.id}
                    subPeriodId={subPeriodDest.id}
                    subjectId={subjectDest.id}
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
              title={'Licence invalide'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SequentialNoteCopy

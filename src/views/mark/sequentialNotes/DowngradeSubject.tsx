import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Select from '@/@core/components/select'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import SequentialNoteAdd from './SequentialNoteAdd'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import { selectThemeColors } from '@/utils/Utils'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesForNoteQuery,
  useDowngradeSubjectQuery,
  useSubPeriodsQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const DowngradeSubject = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.exclude'))
  const { enterpriseId } = useAuthentication()
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)
  const [subject, setSubject] = useState<{ [key: string]: any } | null>(null)
  const [subPeriod, setSubPeriod] = useState<{ [key: string]: any } | null>(
    null,
  )

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

  const { data: dataSubject, loading: loadingSubject } =
    useSubjectsForNotesQuery({
      variables: { id: clazz ? Number(clazz.id) : -1 },
      skip: !clazz,
    })

  const { data: dataNote, loading: loadingNote } = useDowngradeSubjectQuery({
    variables: {
      classId: clazz ? (Number(clazz.id) as any) : null,
      subPeriodId: subPeriod ? (Number(subPeriod.id) as any) : null,
      subjectId: subject ? (Number(subject.id) as any) : null,
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
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.sequentialNotes')} />
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-4/12">
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

            <div className="w-full md:w-4/12">
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
                    placeholder="Sélectionnez une séquence"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
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
                  placeholder="Sélectionner une matière"
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isClearable
                />
              </div>
            )}
          </div>
        </div>

        {clazz && subPeriod && subject && (
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
                  //appreciations={dataAppreciation.markAppreciations && dataLanguage.lang ? dataAppreciation.markAppreciations.filter(({language}) => language.id === dataLanguage.lang.id) : null}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DowngradeSubject

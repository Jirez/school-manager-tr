import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Select from '@/@core/components/select'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import SequentialNoteDelete from './SequentialNoteDelete'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesForNoteQuery,
  useSubPeriodsQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const DeleteNote = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.delete'))
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
                    options={clazzes || undefined}
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
                    components={{ Option: subPeriodOptions }}
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
              <div className="w-full md:w-3/12">
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

            {clazz && subPeriod && subject && (
              <div className="w-full md:w-1/12">
                <SequentialNoteDelete
                  classId={clazz.id}
                  subPeriodId={subPeriod.id}
                  subjectId={subject.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteNote

import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useEffect } from 'react'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import PageHeader from '@/@core/components/ui/page-header'
import { classOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import AnnualNoteAdd from './AnnualNoteAdd'
import {
  ClassCreatedDocument,
  useAnnualNotesQuery,
  useClassesForNoteQuery,
  useSubjectsForNotesQuery,
} from '@/gql/graphql'

const QuarterlyNotes = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subject, setSubject] = useState<{ [key: string]: any } | null>()
  //const [schoolYear, setSchoolYear] = useState<{ [key: string]: any }>();

  const { t } = useTranslation()
  useTitle(t('sidebar.marks.annualNotes'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  /* const { data: dataSchoolYear, loading: loadingPeriod, subscribeToMore: subscribeToMoreSubPeriod } = useQuery(getSchoolYears, {
        variables: { id: enterpriseId },
        fetchPolicy: "network-only"
    }
    ); */

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
  } = useAnnualNotesQuery({
    variables: {
      classId: clazz ? Number(clazz.id) : -1,
      schoolId: enterpriseId,
      subjectId: subject ? Number(subject.id) : -1,
    },
    skip: !clazz || !enterpriseId || !subject,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'annualNote') {
          setSubject(null)
        }
      }
    })
  })

  //console.log(JSON.parse(localStorage.getItem(TokenStorage.authUserKey())!))

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.annualNotes')} />
        </div>

        <div className="flex flex-col md:flex-row gap-0.5 ">
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
                  options={
                    clazzes?.filter((c: any) => !c.competenceClass) || []
                  }
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

          {/* <div className="w-4/12">
                        <LiveView
                            document={schoolYearSubscription}
                            singleVar="schoolYear"
                            data={dataSchoolYear}
                            loading={loadingPeriod}
                            listVar="schoolYears"
                            subscribeToMore={subscribeToMoreSubPeriod}
                            sortField="label"
                            triggerUpdate={true}
                            enterpriseId={enterpriseId}
                        >
                            {({ schoolYears }) => (
                                <Select
                                    onChange={(val: any) => setSchoolYear(val)}
                                    options={schoolYears || undefined}
                                    getOptionLabel={(option: any) => option.label}
                                    getOptionValue={(option: any) => option.id}
                                    value={schoolYear}
                                    components={{ Option: schoolYearOptions }}
                                    placeholder="Sélectionnez une année scolaire"
                                    className='react-select'
                                    classNamePrefix="select"
                                    theme={selectThemeColors}
                                />
                            )}
                        </LiveView>
                    </div> */}

          {clazz && (
            <div className="w-full md:w-4/12">
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
          subject && (
            <div className="w-full">
              {loadingNote ? (
                <LoadingSpinner />
              ) : (
                <div className="card" style={{ marginTop: 20 }}>
                  <AnnualNoteAdd
                    annualNotes={dataNote?.annualNotes}
                    classId={clazz.id}
                    schoolId={enterpriseId}
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

export default QuarterlyNotes

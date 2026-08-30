import { useEffect } from 'react'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import { levelOptions } from '@/utils/select/selectComponents'
import PageHeader from '@/@core/components/ui/page-header'
import {
  LevelCreatedDocument,
  useLevelsQuery,
  useSchoolFeeLevelSimpleQuery,
} from '@/gql/graphql'
import SchoolFeeLevelAdd from './SchoolFeeLevelAdd'

const SchoolFeeLevels = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.schoolFeeLevels'))
  const { enterpriseId } = useAuthentication()

  const [level, setLevel] = useState<{ [key: string]: any } | null>(null)

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataCompetence, loading: loadingCompetence } =
    useSchoolFeeLevelSimpleQuery({
      variables: {
        levelId: level ? Number(level.id) : -1,
        schoolId: enterpriseId,
      },
      skip: !level,
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'expectedCompetence') {
          setLevel(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.payments.schoolFeeLevels')} />
        </div>

        <div className="flex flex-row space-x-5">
          <div className="w-6/12 md:w-4/12 lg:w-3/12">
            <LiveView
              document={LevelCreatedDocument}
              singleVar="level"
              data={data}
              listVar="levels"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              loading={loading}
            >
              {({ levels }) => (
                <Select
                  onChange={(val) => {
                    setLevel(val)
                  }}
                  options={levels || undefined}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  value={level}
                  components={{ Option: levelOptions }}
                  //formId="clazz"
                  placeholder="Sélectionnez un niveau"
                />
              )}
            </LiveView>
          </div>
        </div>
      </div>

      {level && (
        <div className="w-full">
          {loadingCompetence ? (
            <LoadingSpinner />
          ) : (
            <div className="card" style={{ marginTop: 20 }}>
              <SchoolFeeLevelAdd
                fees={dataCompetence?.fees}
                levelId={level.id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SchoolFeeLevels

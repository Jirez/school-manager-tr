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
  useSubCompetencesByLevelQuery,
} from '@/gql/graphql'
import SubCompetenceAdd from './SubCompetenceAdd'

const CompetenceLevel = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.primary.competences'))
  const { enterpriseId } = useAuthentication()

  const [level, setLevel] = useState<{ [key: string]: any } | null>(null)

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataCompetence, loading: loadingCompetence } =
    useSubCompetencesByLevelQuery({
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
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.primary.competences')} />
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-4/12 lg:w-3/12">
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
            <div className="" style={{ marginTop: 20 }}>
              <SubCompetenceAdd
                competences={dataCompetence?.subCompetences}
                levelId={level.id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CompetenceLevel

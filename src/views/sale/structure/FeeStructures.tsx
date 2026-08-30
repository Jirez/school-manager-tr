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
  useFeeStructureLazyQuery,
  useLevelsQuery,
} from '@/gql/graphql'
import FeeStructureAdd from './FeeStuctureAdd'
import dayjs from 'dayjs'

const FeeStructures = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.schoolFeeLevels'))
  const { enterpriseId } = useAuthentication()

  const [level, setLevel] = useState<{ [key: string]: any } | null>(null)
  const [model, setModel] = useState<{ [key: string]: any } | null>(null)

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [
    loadFeeStructure,
    { data: dataFeeStructure, loading: loadingFeeStructure },
  ] = useFeeStructureLazyQuery({
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

  useEffect(() => {
    if (model && model.id) {
      loadFeeStructure({
        variables: {
          levelId: Number(model.id),
          schoolId: enterpriseId,
        },
      })
    }
  }, [model])

  useEffect(() => {
    if (level && level.id) {
      loadFeeStructure({
        variables: {
          levelId: Number(level.id),
          schoolId: enterpriseId,
        },
      })
    }
  }, [level])

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
            >
              {({ levels }) => (
                <Select
                  name="model"
                  onChange={(val) => {
                    setModel(val)
                  }}
                  options={levels || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: levelOptions }}
                  placeholder={t('label-selectLevel')}
                />
              )}
            </LiveView>
          </div>
        </div>
      </div>

      {level && (
        <div className="w-full">
          {loadingFeeStructure ? (
            <LoadingSpinner />
          ) : (
            <div className="card0" style={{ marginTop: 20 }}>
              <FeeStructureAdd
                fees={dataFeeStructure?.fees?.map((fee) => ({
                  ...fee,
                  items: fee.items.map((item) => ({
                    ...item,
                    items: item.items.map((subItem) => ({
                      ...subItem,
                      dueDate: dayjs(subItem.dueDate).isValid()
                        ? dayjs(subItem.dueDate).toDate()
                        : null,
                    })),
                  })),
                }))}
                levelId={level?.id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FeeStructures

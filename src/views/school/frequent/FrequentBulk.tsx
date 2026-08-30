import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import { classOptions } from '@/utils/select/selectComponents'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import { selectThemeColors } from '@/utils/Utils'
import {
  ClassCreatedDocument,
  useClassesQuery,
  useFrequentByClassQuery,
} from '@/gql/graphql'
import FrequentBulkUpdate from './FrequentBulkUpdate'

const FrequentBulk = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>()
  const { t } = useTranslation()
  useTitle(t('sidebar.students.frequents'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataPlanning, loading: loadingPlanning } =
    useFrequentByClassQuery({
      variables: {
        classId: clazz ? (Number(clazz.id) as any) : null,
      },
      skip: !clazz,
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'classDistribution') {
          setClazz(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <PageHeader title={t('sidebar.students.frequents')} />
        </div>

        <div className="w-full">
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
            >
              {({ clazzes }) => (
                <Select
                  theme={selectThemeColors}
                  onChange={(val) => setClazz(val)}
                  options={clazzes || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  placeholder="Sélectionnez une classe"
                />
              )}
            </LiveView>
          </div>
        </div>

        {clazz && (
          <div className="w-full">
            <div className="card" style={{ marginTop: 20 }}>
              {loadingPlanning ? (
                <LoadingSpinner />
              ) : (
                <FrequentBulkUpdate
                  frequents={dataPlanning?.frequent}
                  classId={clazz.id}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FrequentBulk

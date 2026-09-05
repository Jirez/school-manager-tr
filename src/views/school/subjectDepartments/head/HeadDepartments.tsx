import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'ahooks'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import { useHeadDepartmentQuery } from '@/gql/graphql'
import HeadDepartmentAdd from './HeadDepartmentAdd'
import { concat } from '#/utils/helpers'

const HeadDepartments = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.subjects.headDepartments'))
  const { enterpriseId } = useAuthentication()

  const { data: dataPlanning, loading: loadingPlanning } =
    useHeadDepartmentQuery({
      variables: {
        id: enterpriseId,
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'headDepartment') {
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full">
      <div>
        <div className="w-full">
          <PageHeader title={t('sidebar.subjects.headDepartments')} />
        </div>

        <div className="w-full">
          <div className="card" style={{ marginTop: 20 }}>
            {loadingPlanning ? (
              <LoadingSpinner />
            ) : (
              <HeadDepartmentAdd
                headDepartments={dataPlanning?.headDepartments?.map((item) => ({
                  ...item,
                  lastName: concat(
                    item?.teacher?.lastName || '',
                    item?.teacher?.firstName || '',
                  ),
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeadDepartments

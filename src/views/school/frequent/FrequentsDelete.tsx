import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import useConfirm from '@/@core/components/confirm/useConfirm'
import Button from '@/@core/components/button'
import { useTranslation } from 'react-i18next'
import {
  StudentPaymentsExistsDocument,
  useFrequentsDeleteMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'

const FrequentsDelete = (props: any) => {
  const { enterpriseId } = useAuthentication()
  const { confirm } = useConfirm()
  const { t } = useTranslation()
  const client = useApolloClient()
  const { ids } = props
  const studentIds: number[] = ids.map((item: any) => Number(item.studentId))
  // console.log(studentIds);

  const [deleteItem, { loading }] = useFrequentsDeleteMutation()
  /* {
            update(cache, { data }) {
                const list: { [key: string]: [] } | null = cache.readQuery({
                    query: getFrequents,
                    variables: { "id": enterpriseId }
                });

                const listVar = "frequents";

                cache.writeQuery({
                    query: getFrequents,
                    variables: { id: enterpriseId },
                    data: { [listVar]: list![listVar].filter((e: any) => !studentIds.includes(e.frequentPK.studentId)) }
                });
            }
        } */
  // console.log(id, " from mutation ")

  const handleDelete = (action: typeof deleteItem, ids: any) => {
    action({ variables: { ids } })
      .then(async ({ data }) => {
        toast.success('Suppression effectuée', { ...TOAST_OPTIONS })
        props.refetch?.()
      })
      .catch((error) => {
        toast.error(`Suppression non effectuée : ${error}`)
      })
  }

  const showConfirm = async () => {
    const isConfirmed = await confirm(
      'Voulez-vous vraiment supprimer ces éléments ?',
    )

    if (isConfirmed) {
      // check if payment exists
      const { data } = await client.query({
        query: StudentPaymentsExistsDocument,
        variables: { studentIds, schoolId: enterpriseId },
        fetchPolicy: 'no-cache',
      })

      if (data && data.studentPaymentsExists) {
        toast.error(
          "Ces élèves ont des paiements enregistrés. Il faut d'abord supprimer ces derniers afin que l'opération soit autorisée.",
        )
        return
      }

      handleDelete(deleteItem, ids!)
    }
  }

  return (
    <span className="delete-btn" onClick={showConfirm}>
      <Button
        color="primary"
        className="round text-sm"
        loading={loading}
        type="button"
        size="sm"
      >
        {t('label-deleteAll')}
        <span className="ml-1 rounded-full text-xs p-[2px] w-2 h-2 bg-red-700">
          {String(props.count).padStart(2, '0')}
        </span>
      </Button>
    </span>
  )
}

export default FrequentsDelete

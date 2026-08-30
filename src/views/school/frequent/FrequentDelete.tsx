import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import { Trash2 } from 'react-feather'
import useConfirm from '@/@core/components/confirm/useConfirm'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTranslation } from 'react-i18next'
import {
  StudentPaymentExistsDocument,
  useFrequentDeleteMutation,
} from '@/gql/graphql'

const FrequentDelete = (props: any) => {
  const { enterpriseId } = useAuthentication()
  const { confirm } = useConfirm()
  const client = useApolloClient()
  const { t } = useTranslation()
  const { id, classic } = props

  const [deleteItem] = useFrequentDeleteMutation()
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
                    data: { [listVar]: list![listVar].filter((e: any) => e.frequentPK.studentId !== id.studentId) }
                });
            }
        } */

  const handleDelete = (action: typeof deleteItem, id: any) => {
    action({ variables: { id: id } })
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
      'Voulez-vous vraiment supprimer cet élément ?',
    )

    if (isConfirmed) {
      // check if payment exists
      const { data } = await client.query({
        query: StudentPaymentExistsDocument,
        variables: { studentId: id.studentId, schoolId: enterpriseId },
        fetchPolicy: 'no-cache',
      })

      if (data && data.studentPaymentExists) {
        toast.error(
          "Cet élève a des paiements enregistrés. Il faut d'abord supprimer ces derniers pour que l'opération soit autorisée.",
        )
        return
      }

      handleDelete(deleteItem, id!)
    }
  }

  return (
    <>
      {classic && (
        <span
          className="delete-btn border hover:bg-red-200 rounded-full p-[5px] mx-0.5"
          onClick={showConfirm}
          title={t('label-delete')}
        >
          <Trash2 size={15} color="darkred" />
        </span>
      )}

      {!classic && (
        <span
          className="flex items-center px-[8px] py-[5px] text-gray-600 capitalize bg-opacity-100 duration-300 transform cursor-pointer dark:text-gray-300 hover:bg-gray-100"
          onClick={showConfirm}
        >
          <span className="w-5 h-5">
            <Trash2 size={15} className="text-red-900 " />
          </span>

          <span className="mx-1 text-[0.88rem] font-medium">
            {t('label-delete')}
          </span>
        </span>
      )}
    </>
  )
}

export default FrequentDelete

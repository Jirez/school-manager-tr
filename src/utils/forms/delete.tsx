import React from 'react'
import { useMutation } from '@apollo/client'
import type { MutationFunctionOptions } from '@apollo/client'
import type { DocumentNode } from 'graphql'
import { toast } from 'react-toastify'
import useConfirm from '@/@core/components/confirm/useConfirm'
import { useAuthentication } from '@/hooks/useAuthentication'
import { Trash2 } from 'react-feather'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTranslation } from 'react-i18next'
// import {MdDeleteForever} from "react-icons/md"

interface DeleteProps {
  mutation: DocumentNode
  query: DocumentNode
  listVar: string
  singleVar?: string
  id?: string
  refetch?: () => void
  onComplete?: () => void
  classic?: boolean
  updateCache?: boolean
  filterKey?: string
}

const DeleteItem: React.FC<DeleteProps> = ({
  mutation,
  query,
  listVar,
  singleVar,
  classic = true,
  updateCache = true,
  filterKey = 'id',
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const { confirm } = useConfirm()
  const { t } = useTranslation()

  const [deleteItem] = useMutation(mutation, {
    // client: client,
    update(cache, { data }) {
      if (updateCache) {
        const list: { [key: string]: [] } | null = cache.readQuery({
          query: query,
          variables: { id: enterpriseId },
        })

        cache.writeQuery({
          query: query,
          variables: { id: enterpriseId },
          data: {
            [listVar]: list![listVar].filter((e: any) => e[filterKey] != id),
          },
          overwrite: true,
        })
      }
    },
  })

  // const deleteItem = () => console.log('Deleting data');
  const { id } = props

  const handleDelete = (
    action: (option: MutationFunctionOptions) => Promise<any>,
    id: string,
  ) => {
    action({ variables: { id: id } })
      .then(async () => {
        toast.success('Suppression effectuée', { ...TOAST_OPTIONS })
        props.refetch?.()
        props.onComplete?.()
      })
      .catch((err) => {
        toast.error(err.message ? err.message : 'Suppression non effectuée')
      })
  }

  const showConfirm = async () => {
    const isConfirmed = await confirm(
      'Voulez-vous vraiment supprimer cet élément ?',
    )

    if (isConfirmed) {
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
          className="flex items-center px-1 py-1 text-gray-600 capitalize bg-opacity-100 duration-300 transform cursor-pointer dark:text-gray-300 hover:bg-gray-100 hover:text-primary dark:hover:text-primary dark:hover:bg-gray-700"
          onClick={showConfirm}
        >
          <span className="w-5 h-5">
            <Trash2 size={15} className="text-red-900 hover:text-primary" />
          </span>

          <span className="mx-1">{t('label-delete')}</span>
        </span>
      )}
    </>
  )
}

export default DeleteItem

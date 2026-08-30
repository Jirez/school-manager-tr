import React from 'react'
import { useMutation } from '@apollo/client'
import type { MutationFunctionOptions } from '@apollo/client'
import type { DocumentNode } from 'graphql'
import { toast } from 'react-toastify'
import useConfirm from '@/@core/components/confirm/useConfirm'
import { useAuthentication } from '@/hooks/useAuthentication'
import Button from '@/@core/components/button'
import { useTranslation } from 'react-i18next'
import { TOAST_OPTIONS } from '@/utils/constants'
// import {MdDeleteForever} from "react-icons/md"

interface DeleteProps {
  mutation: DocumentNode
  query: DocumentNode
  listVar: string
  singleVar?: string
  ids: any[]
  count?: number
}

const DeleteAllItem: React.FC<DeleteProps> = ({
  mutation,
  query,
  listVar,
  singleVar,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const { confirm } = useConfirm()
  const { t } = useTranslation()

  const [deleteItem, { loading }] = useMutation(mutation, {
    // client: client,
    update(cache, { data }) {
      const list: { [key: string]: [] } | null = cache.readQuery({
        query: query,
        variables: { id: enterpriseId },
      })

      cache.writeQuery({
        query: query,
        variables: { id: enterpriseId },
        data: {
          [listVar]: list![listVar].filter((e: any) => !ids.includes(e.id)),
        },
        overwrite: true,
      })
    },
  })

  // const deleteItem = () => console.log('Deleting data');
  const { ids } = props

  const handleDelete = (
    action: (option: MutationFunctionOptions) => Promise<any>,
    ids: any[],
  ) => {
    action({ variables: { ids } })
      .then(async () => {
        toast.success('Suppression effectuée', { ...TOAST_OPTIONS })
      })
      .catch((err) => {
        toast.error(err.message ? err.message : 'Suppression non effectuée')
      })
  }

  const showConfirm = async () => {
    const isConfirmed = await confirm(
      'Voulez-vous vraiment supprimer ces éléments ?',
    )

    if (isConfirmed) {
      handleDelete(deleteItem, ids!)
    } /* else {
            setMessage('Declined.')
        }*/
  }

  return (
    <span className="delete-btn" onClick={showConfirm}>
      <Button
        color="primary"
        className="round"
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

export default DeleteAllItem

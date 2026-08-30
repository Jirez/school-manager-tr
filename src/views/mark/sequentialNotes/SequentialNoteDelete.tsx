import type { FC } from 'react'
//import { Trash } from "react-feather";
import { toast } from 'react-toastify'
import useConfirm from '@/@core/components/confirm/useConfirm'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { useSequentialNoteDeleteMutation } from '@/gql/graphql'

interface DeleteSequentialNoteProps {
  classId: number
  subjectId: number
  subPeriodId: number
}

const SequentialNoteDelete: FC<DeleteSequentialNoteProps> = (props) => {
  const { confirm } = useConfirm()
  const [deleteItem, { loading }] = useSequentialNoteDeleteMutation()

  const handleDelete = (action: typeof deleteItem) => {
    action({
      variables: {
        classId: props.classId,
        subjectId: props.subjectId,
        subPeriodId: props.subPeriodId,
      },
    })
      .then(async ({}) => {
        toast.info('Suppression effectuée')
        messageService.sendMessage('sequentialNote', true)
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
      handleDelete(deleteItem)
    } /*else {
            setMessage('Declined.')
        }*/
  }

  return (
    <span className="delete-btn" onClick={showConfirm}>
      <Button color="primary" className="round" loading={loading}>
        Supprimer
      </Button>
    </span>
  )
}

export default SequentialNoteDelete

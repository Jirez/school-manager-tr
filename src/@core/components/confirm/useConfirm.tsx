import { useCallback } from 'react'
import { useConfirmDispatch, useConfirmState } from '@/context/confirm-context'
import { HIDE_CONFIRM, SHOW_CONFIRM } from '@/utils/constants'

let resolveCallback: (value: boolean) => void
const useConfirm = () => {
  const dispatch = useConfirmDispatch()
  const hideConfirm = useCallback(
    () => dispatch({ type: HIDE_CONFIRM }),
    [dispatch],
  )

  /* const showConfirm = useCallback(() => dispatch({type: SHOW_CONFIRM, payload: {text: message}}), [
        dispatch
    ]);*/

  const isOpen = useConfirmState('isOpen')
  const title = useConfirmState('title')
  const text = useConfirmState('text')
  const type = useConfirmState('type')

  const onConfirm = () => {
    hideConfirm()
    resolveCallback(true)
  }

  const onClosed = () => {
    hideConfirm()
    resolveCallback(false)
  }

  const confirm = (text: string) => {
    // setMessage(text);
    // showConfirm()
    dispatch({ type: SHOW_CONFIRM, payload: { text } })

    return new Promise<boolean>((resolve, _) => {
      resolveCallback = resolve
    })
  }

  return { confirm, onConfirm, onClosed, isOpen, text, title, type }
}

export default useConfirm

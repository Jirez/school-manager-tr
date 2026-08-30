import { HIDE_CONFIRM, SHOW_CONFIRM } from '@/utils/constants'
import { createCtx } from './create-context'
import type { ConfirmDialogType } from '@/@core/components/confirm/confirm-dialog'

type State = {
  isOpen: boolean
  text: string
  title: string
  type: ConfirmDialogType
}

type Action = any

const initialState = {
  isOpen: false,
  text: '',
  title: '',
  type: 'warning',
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case SHOW_CONFIRM:
      return {
        isOpen: true,
        text: action.payload.text,
        title: action.payload.title,
        type: action.payload.type,
      }
    case HIDE_CONFIRM:
      return initialState
    default:
      return state
  }
}

// const ConfirmContext = React.createContext({} as State);
const [useConfirmState, useConfirmDispatch, ConfirmProvider] = createCtx(
  initialState,
  reducer,
)

export { useConfirmState, useConfirmDispatch, ConfirmProvider }

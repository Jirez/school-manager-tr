import type { PropsWithChildren } from 'react'
import type { SortingState, Row } from '@tanstack/react-table'
import React from 'react'

interface State {
  pageIndex: number
  pageSize: number
  sorting: SortingState | any
  selectedRow: Row<any, any>[]
}

const initialState: State = {
  pageIndex: 0,
  pageSize: Number(localStorage.getItem('PageSize')) || 10,
  sorting: [],
  selectedRow: [],
}

type Action =
  | { type: 'SET_PAGE_INDEX'; value: number }
  | { type: 'SET_PAGE_SIZE'; value: number }
  | { type: 'SET_SORT'; value: SortingState }
  | { type: 'SET_SELECTED_ROW'; value: Row<any, any>[] }

interface TableContextProps extends State {
  setPageSize: Function
  setPageIndex: Function
  setSorting: Function
  setSelectedRow: Function
}

export const TableContext = React.createContext<State | TableContextProps>(
  initialState,
)

TableContext.displayName = 'TableContext'

function tableReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_PAGE_INDEX': {
      return {
        ...state,
        pageIndex: action.value,
      }
    }

    case 'SET_PAGE_SIZE': {
      return {
        ...state,
        pageSize: action.value,
      }
    }

    case 'SET_SORT': {
      return {
        ...state,
        sorting: action.value,
      }
    }

    case 'SET_SELECTED_ROW': {
      return {
        ...state,
        selectedRow: action.value,
      }
    }
  }
}

export const TableProvider: React.FC<PropsWithChildren<any>> = (props) => {
  const [state, dispatch] = React.useReducer(tableReducer, initialState)

  const setPageIndex = (value: number) =>
    dispatch({ type: 'SET_PAGE_INDEX', value })
  const setPageSize = (value: number) =>
    dispatch({ type: 'SET_PAGE_SIZE', value })
  const setSorting = (value: SortingState) =>
    dispatch({ type: 'SET_SORT', value })
  const setSelectedRow = (value: Row<any, any>[]) =>
    dispatch({ type: 'SET_SELECTED_ROW', value })

  const value: TableContextProps = React.useMemo(
    () => ({
      ...state,
      setPageIndex,
      setPageSize,
      setSorting,
      setSelectedRow,
    }),
    [state],
  )

  return <TableContext.Provider value={value} {...props} />
}

export const useTable = () => {
  // @ts-ignore test
  const context = React.useContext<TableContextProps>(TableContext)
  if (context === undefined) {
    throw new Error(`useTable must be used within a TableProvider`)
  }
  return context
}

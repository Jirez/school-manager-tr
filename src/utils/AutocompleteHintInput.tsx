import React, { useState, useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { useKeyPress } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { Hint } from '@/utils/libraries'
import type { HintProps } from '@/utils/libraries'

interface AutocompleteHintInputProps<T = HintOption> {
  placeholder?: string
  options: Array<string> | Array<T>
  disableHint?: boolean
  allowTabFill?: boolean

  onFill?(value: string | T): void

  onHint?(value: string | T | undefined): void

  valueModifier?(value: string): string

  onChange?(value: string): void

  clearText?(): void

  // New props
  uniqueKey?: string

  getOptionLabel?(): Array<string> //no need to be a function
  onMatchFail?(value: boolean): void //value parameter is true when there is no possible match
  onMoreHintFail?(value: boolean): void //value parameter is true when there are no more possible hint when pressing ArrowUp or ArrowDown
  onOpenModal?(value: string): void
  //
  form?: ReactElement
  formId?: string
  modalWidth?: string
  focus$?: EventEmitter<void>
  text$?: EventEmitter<string>
  initialText?: string
  autoFocus?: boolean
}

const AutocompleteHintInput: React.FC<AutocompleteHintInputProps> = ({
  autoFocus = true,
  ...props
}) => {
  const [text, setText] = useState(props.initialText || '')
  const [bounce, setBounce] = useState(false)
  /* const [showAddButton, setShowAddButton] = useState(false);
    const [state, {setTrue, setFalse}] = useBoolean(false);*/
  const inputRef = useRef<HTMLInputElement>(null)

  const focusAndScroll = (): void => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView(false)
  }

  useKeyPress('ctrl.q', () => {
    focusAndScroll()
  })

  props.focus$?.useSubscription(() => focusAndScroll())
  props.text$?.useSubscription((value) => setText(value))

  useEffect(() => {
    let timeout: any
    if (bounce) {
      timeout = setTimeout(() => setBounce(false), 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [bounce])

  /* const onMatchFail = (value: boolean) => {
        if (value && text) {
            setShowAddButton(true);
        } else {
            setShowAddButton(false);
        }
    };*/

  const onFill = (value: string | HintOption) => {
    setText('')
    props.onFill?.(value)
    // inputRef.current?.focus()
  }

  useEffect(() => {
    if (autoFocus) {
      focusAndScroll()
    }
  }, [])

  return (
    <>
      <Hint
        {...(props as HintProps)}
        onFill={onFill}
        // onMatchFail={onMatchFail}
        onMoreHintFail={(value) => setBounce(value)}
        onCompleteWord={(value) => setText(value)}
        onOpenModal={(value) => props.onOpenModal?.(value)}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e: any) => {
            setText(e.target.value)
            props.onChange?.(e.target.value)
          }}
          className={`simple-input form-control  ${bounce ? 'bounce' : ''}`}
          placeholder={props.placeholder}
        />
      </Hint>
      {/* {showAddButton && <Button type="primary" onClick={setTrue}>Ajouter</Button>}*/}

      {/* <Modal
                width={props.modalWidth ? props.modalWidth: 520}
                visible={state}
                onCancel={setFalse}
                okText="Ajouter"
                onOk={() => document.getElementById(props.formId!)?.click()}
                destroyOnClose={true}
            >
                {props.form && cloneElement(props.form!, {popover: true, onModalClose: () => setFalse()})}
            </Modal>*/}
    </>
  )
}

export default AutocompleteHintInput

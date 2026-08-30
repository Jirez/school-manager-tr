import React, { useState, cloneElement, useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import type { HintOption } from './HintOption'
import {
  mergeRefs,
  interpolateStyle,
  sortAsc,
  getFirstDuplicateOption,
  optionLabelExists,
  getOptionLabelText,
  getOriginalMatch,
} from './utils'

export interface HintProps<T = HintOption> {
  options: Array<string> | Array<T>
  disableHint?: boolean
  children: ReactElement
  allowTabFill?: boolean
  onFill?(value: string | T): void
  onHint?(value: string | T | undefined): void
  valueModifier?(value: string): string
  onCompleteWord(value: string): void
  onOpenModal(value: string): void
  //New props
  uniqueKey?: string
  getOptionLabel?(): Array<string> //no need to be a function
  onMatchFail?(value: boolean): void //value parameter is true when there is no possible match
  onMoreHintFail?(value: boolean): void //value parameter is true when there are no more possible hint when pressing ArrowUp or ArrowDown
}

export const Hint: React.FC<HintProps> = <T,>(
  props: React.PropsWithChildren<HintProps>,
) => {
  const child = React.Children.only(props.children)

  if (child.type?.toString()?.toLowerCase() !== 'input') {
    throw new TypeError(
      `react-autocomplete-hint: 'Hint' only accepts an 'input' element as child.`,
    )
  }

  const {
    options,
    disableHint,
    allowTabFill,
    onFill,
    onHint,
    valueModifier,
    getOptionLabel,
    uniqueKey,
    onMatchFail,
    onMoreHintFail,
  } = props

  const childProps = child.props

  let inputWrapperRef = useRef<HTMLDivElement>(null)
  let mainInputRef = useRef<HTMLInputElement>(null)
  let hintWrapperRef = useRef<HTMLSpanElement>(null)
  let hintRef = useRef<HTMLInputElement>(null)
  const [unModifiedText, setUnmodifiedText] = useState('')
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')
  const [match, setMatch] = useState<string | HintOption>() // todo refactor using generic HintOption type
  const [changeEvent, setChangeEvent] =
    useState<React.ChangeEvent<HTMLInputElement>>()
  const [computedOptions, setComputedOptions] = useState<
    Array<{ [key: string]: string; label: string }>
  >([])
  const [hintLength, setHintLength] = useState(0)
  const hintIdx = useRef(0) // index of the selected hint

  useEffect(() => {
    if (typeof options[0] === 'object') {
      // check available option label
      if (!optionLabelExists(options as Array<HintOption>, getOptionLabel)) {
        throw new Error(`react-autocomplete-hint: no option label found`)
      }

      // compute options from getOptionLabel
      let duplicate: string | null
      if (uniqueKey) {
        const co = (options as Array<HintOption>).map((x) => ({
          [uniqueKey]: x[uniqueKey],
          label: getOptionLabelText(x, getOptionLabel),
        }))

        setComputedOptions(co)

        duplicate = getFirstDuplicateOption(
          co as Array<HintOption>,
          getOptionLabel,
        )
      } else {
        // Find duplicates entries
        duplicate = getFirstDuplicateOption(
          options as Array<HintOption>,
          getOptionLabel,
        )
      }

      if (duplicate) {
        console.warn(
          `react-autocomplete-hint: "${duplicate}" occurs more than once and may cause errors. Options should not contain duplicate values!`,
        )
      }
    }
  }, [])

  useEffect(() => {
    if (disableHint) {
      return
    }

    const inputStyle =
      mainInputRef.current && window.getComputedStyle(mainInputRef.current)
    inputStyle &&
      styleHint(inputWrapperRef, hintWrapperRef, hintRef, inputStyle)
  })

  const getMatch = (text: string) => {
    if (!text || text === '') {
      return
    }

    if (typeof options[0] === 'string') {
      const possibleHints = (options as Array<string>)
        .filter(
          (x) =>
            x.toLowerCase() !== text.toLowerCase() &&
            x.toLowerCase().startsWith(text.toLowerCase()),
        )
        .sort()

      setHintLength(possibleHints.length)
      return hintIdx.current < possibleHints.length
        ? possibleHints[hintIdx.current]
        : possibleHints[0]
    } else {
      const possibleHints = (computedOptions as Array<HintOption>)
        .filter(
          (x) =>
            x.label.toLowerCase() !== text.toLowerCase() &&
            x.label.toLowerCase().startsWith(text.toLowerCase()),
        )
        .sort((a, b) => sortAsc<string>(a.label, b.label))

      setHintLength(possibleHints.length)
      return hintIdx.current < possibleHints.length
        ? possibleHints[hintIdx.current]
        : possibleHints[0]
    }
  }

  const setHintTextAndId = (text: string) => {
    setText(text)

    const match = getMatch(text)
    let hint: string

    if (!match) {
      hint = ''
      if (typeof options[0] === 'object') {
        onMatchFail?.(true)
      } else {
        onMatchFail?.(true)
      }
    } else if (typeof match === 'string') {
      hint = match.slice(text.length)
      onMatchFail?.(false)
    } else {
      // hint = match.label.slice(text.length);
      hint = match.label.slice(text.length)
      onMatchFail?.(false)
    }

    setHint(hint)
    if (uniqueKey && typeof match === 'object') {
      const originalMatch = getOriginalMatch(
        uniqueKey,
        match?.[uniqueKey],
        options as Array<HintOption>,
      )
      setMatch(originalMatch)
      onHint?.(originalMatch)
    } else {
      setMatch(match)
      onHint?.(match)
    }
  }

  const handleOnFill = () => {
    if (hint !== '' && changeEvent) {
      changeEvent.target.value = unModifiedText + hint
      childProps.onChange && childProps.onChange(changeEvent)
      setHintTextAndId('')

      onFill?.(match!)
    }
  }

  const styleHint = (
    inputWrapperRef: React.RefObject<HTMLDivElement>,
    hintWrapperRef: React.RefObject<HTMLSpanElement>,
    hintRef: React.RefObject<HTMLInputElement>,
    inputStyle: CSSStyleDeclaration,
  ) => {
    if (inputWrapperRef?.current?.style) {
      inputWrapperRef.current.style.width = inputStyle.width
    }

    if (hintWrapperRef?.current?.style) {
      hintWrapperRef.current.style.fontFamily = inputStyle.fontFamily
      hintWrapperRef.current.style.fontSize = inputStyle.fontSize
      hintWrapperRef.current.style.width = inputStyle.width
      hintWrapperRef.current.style.height = inputStyle.height
      hintWrapperRef.current.style.lineHeight = inputStyle.lineHeight
      hintWrapperRef.current.style.boxSizing = inputStyle.boxSizing
      hintWrapperRef.current.style.margin = interpolateStyle(
        inputStyle,
        'margin',
      )
      hintWrapperRef.current.style.padding = interpolateStyle(
        inputStyle,
        'padding',
      )
      hintWrapperRef.current.style.borderStyle = interpolateStyle(
        inputStyle,
        'border',
        'style',
      )
      hintWrapperRef.current.style.borderWidth = interpolateStyle(
        inputStyle,
        'border',
        'width',
      )
    }

    if (hintRef?.current?.style) {
      hintRef.current.style.fontFamily = inputStyle.fontFamily
      hintRef.current.style.fontSize = inputStyle.fontSize
      hintRef.current.style.lineHeight = inputStyle.lineHeight
    }
  }

  const onCompleteWord = (value: string) => {
    hintIdx.current = 0 //reset hintIndex
    props.onCompleteWord(value)
    setUnmodifiedText(value)
    const modifiedValue = valueModifier ? valueModifier(value) : value
    setHintTextAndId(modifiedValue)

    //childProps.onChange && childProps.onChange(e);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeEvent(e)
    e.persist()

    hintIdx.current = 0 //reset hintIndex
    setUnmodifiedText(e.target.value)
    const modifiedValue = valueModifier
      ? valueModifier(e.target.value)
      : e.target.value
    setHintTextAndId(modifiedValue)

    childProps.onChange && childProps.onChange(e)
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setHintTextAndId(e.target.value)
    childProps.onFocus && childProps.onFocus(e)
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //Only blur it if the new focus isn't the the hint input
    if (hintRef?.current !== e.relatedTarget) {
      setHintTextAndId('')
      childProps.onBlur && childProps.onBlur(e)
    }
  }

  const ARROWRIGHT = 'ArrowRight'
  const TAB = 'Tab'
  const ARROW_DOWN = 'ArrowDown'
  const ARROW_UP = 'ArrowUp'
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const caretIsAtTextEnd = (() => {
      // For selectable input types ("text", "search"), only select the hint if
      // it's at the end of the input value. For non-selectable types ("email",
      // "number"), always select the hint.

      const isNonSelectableType = e.currentTarget.selectionEnd === null
      const caretIsAtTextEnd =
        isNonSelectableType ||
        e.currentTarget.selectionEnd === e.currentTarget.value.length

      return caretIsAtTextEnd
    })()

    if (caretIsAtTextEnd && e.key === ARROWRIGHT) {
      // if only one possible hint then fill otherwise complete the word
      if (hintLength === 1) {
        handleOnFill()
      } else {
        onCompleteWord(`${text}${hint.split(' ')[0]} `)
      }
      //console.log(hint, " - ", text)
    } else if (
      caretIsAtTextEnd &&
      allowTabFill &&
      e.key === TAB &&
      hint !== ''
    ) {
      if (hintLength === 1) {
        handleOnFill()
      } else {
        onCompleteWord(`${text}${hint.split(' ')[0]} `)
      }
      e.preventDefault() //focus desired field
    }

    if (caretIsAtTextEnd && e.key === ARROW_DOWN && hint !== '') {
      if (hintIdx.current < hintLength - 1) {
        hintIdx.current += 1
        setHintTextAndId(text)
      }

      onMoreHintFail?.(hintIdx.current >= hintLength - 1)
    }

    if (e.key === ARROW_UP && hint !== '' && hintIdx.current > 0) {
      hintIdx.current -= 1
      setHintTextAndId(text)
    }

    if (e.key === ARROW_UP) {
      e.preventDefault()
      onMoreHintFail?.(hintIdx.current === 0)
    }

    if (e.key === ARROW_DOWN) {
      e.preventDefault()
    }

    childProps.onKeyDown && childProps.onKeyDown(e)
  }

  const onHintClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const hintCaretPosition = e.currentTarget.selectionEnd || 0

    // If user clicks the position before the first character of the hint,
    // move focus to the end of the mainInput text
    if (hintCaretPosition === 0) {
      mainInputRef.current?.focus()
      return
    }

    if (!!hint && hint !== '') {
      handleOnFill()
      setTimeout(() => {
        mainInputRef.current?.focus()
        const caretPosition = text.length + hintCaretPosition
        mainInputRef.current?.setSelectionRange(caretPosition, caretPosition)
      }, 0)
    }
  }

  const onKeyPress = (e: any) => {
    //todo merge with onKeyDown
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()

      if (hint === '') {
        props.onOpenModal(text)
      } else {
        handleOnFill()
      }
    }
  }

  const childRef = cloneElement(child as any).ref
  const mainInput = cloneElement(child, {
    ...childProps,
    style: {
      ...childProps.style,
      boxSizing: 'border-box',
    },
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyPress,
    ref:
      childRef && typeof childRef !== 'string'
        ? mergeRefs(childRef, mainInputRef)
        : mainInputRef,
  })

  return (
    <div
      className="rah-input-wrapper"
      style={{
        position: 'relative',
      }}
    >
      {disableHint ? (
        child
      ) : (
        <>
          {mainInput}
          <span
            className="rah-hint-wrapper"
            ref={hintWrapperRef}
            style={{
              display: 'flex',
              pointerEvents: 'none',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxSizing: 'border-box',
              boxShadow: 'none',
              color: 'red', //'rgba(0, 0, 0, 0.35)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <span
              className="rah-text-filler"
              style={{
                visibility: 'hidden',
                pointerEvents: 'none',
                whiteSpace: 'pre',
              }}
            >
              {text}
            </span>
            <input
              className="rah-hint"
              ref={hintRef}
              onClick={onHintClick}
              style={{
                pointerEvents: !hint || hint === '' ? 'none' : 'visible',
                background: 'transparent',
                width: '100%',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                margin: 0,
                color: 'rgba(0, 0, 0, 0.30)',
                caretColor: 'transparent',
              }}
              defaultValue={hint}
              tabIndex={-1}
            />
          </span>
        </>
      )}
    </div>
  )
}

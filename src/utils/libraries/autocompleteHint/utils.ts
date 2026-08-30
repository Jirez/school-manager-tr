import type { MutableRefObject, RefCallback } from 'react'
import _ from 'lodash'

import type { HintOption } from './HintOption'

type MutableRef<T> = RefCallback<T> | MutableRefObject<T> | null

export function mergeRefs(...refs: Array<MutableRef<HTMLElement | null>>) {
  const filteredRefs = refs.filter(Boolean)

  return (inst: HTMLElement) => {
    for (let ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst)
      } else if (ref) {
        ref.current = inst
      }
    }
  }
}

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
export function interpolateStyle(
  styles: CSSStyleDeclaration,
  attr: string,
  subattr: string = '',
): string {
  // Title-case the sub-attribute.
  if (subattr) {
    subattr = subattr.replace(subattr[0], subattr[0].toUpperCase())
  }

  return (
    ['Top', 'Right', 'Bottom', 'Left']
      // @ts-ignore: (attr + dir + subattr) property cannot be determined at compile time
      .map((dir) => styles[attr + dir + subattr])
      .join(' ')
  )
}

export function sortAsc<T>(a: T, b: T) {
  if (a > b) {
    return 1
  }
  if (a < b) {
    return -1
  }
  return 0
}

export function getFirstDuplicateOption(
  array: Array<HintOption>,
  getOptionLabel?: Function,
) {
  let tracker: { [key: string]: boolean } = {}
  let convertedArray
  if ('label' in array[0]) {
    convertedArray = array
  } else {
    convertedArray = array.map((x) => ({
      //id: x.id,
      label: getOptionLabelText(x, getOptionLabel),
    }))
  }

  for (let i = 0; i < convertedArray.length; i++) {
    if (tracker[convertedArray[i].label]) {
      return convertedArray[i].label
    }

    tracker[convertedArray[i].label] = true
  }

  return null
}

export function optionLabelExists(
  options: Array<HintOption>,
  getOptionLabel?: Function,
): boolean {
  if (!getOptionLabel) {
    return 'label' in options[0] // or options.hasOwnProperty('label')
  }

  const labels: string[] = getOptionLabel()

  for (const label of labels) {
    if (!(label in options[0])) {
      return false
    }
  }

  return true
}

function optionLabelText(
  option: HintOption,
  getOptionLabel?: Function,
): string {
  let labels: string[] = getOptionLabel ? getOptionLabel() : ['label']
  let text = ''

  for (const label of labels) {
    if (
      typeof option[label] === 'string' ||
      typeof option[label] === 'number'
    ) {
      text += ' ' + String(option[label]).trim()
    }
  }

  return _.deburr(text.trim())
}

export const getOptionLabelText = (
  option: HintOption,
  getOptionLabel?: Function,
) => optionLabelText(option, getOptionLabel)

export function getOriginalMatch(
  uniqueKey: string,
  uniqueValue: any,
  options: Array<HintOption>,
) {
  return options.filter((x) => x[uniqueKey] === uniqueValue)[0]
}

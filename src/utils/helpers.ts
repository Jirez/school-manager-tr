import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import axios from 'axios'
import _ from 'lodash'
import type { TConfiguration } from './types'
import { useDebounceFn } from 'ahooks'
import type { RefObject } from 'react'
// import Swal from "sweetalert2";

export const unusedChars = (
  value: string | null | undefined,
  maxLength: number,
) => {
  if (!value) {
    return maxLength
  }

  return maxLength - value.length
}

export const coalesce = (
  value?: string | null,
  otherValue: string | null = '',
): string => {
  return value ? value : otherValue || ''
}

export const concat = (...values: string[]) => {
  return values.map((item) => coalesce(item)).reduce((a, b) => a + ' ' + b)
}

export const showDisplayedRowCount = (rows: any[]) => {
  if (document.getElementById('gridCount'))
    document.getElementById('gridCount')!.innerText = rows.length.toString()
}

export const discountPrice = (price: number, discount?: number): number => {
  if (!discount) {
    return price
  }

  return price - (price * discount) / 100
}

export function stopPropagate(callback: () => void) {
  return (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    callback()
  }
}

export const buildOptions = (values: any[]) => {
  const options: number[] = values.map((val: any) => val.id)
  return options.length > 0 ? options.join('-') : null
}

export const preventSubmitting = (e: any, callback?: Function) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    callback?.()
  }
}

export const focusFormListNextField = (
  e: any,
  index: number,
  target: string,
) => {
  if (e.which === 13 || e.key === 'ArrowDown') {
    const input = document.getElementById(`items_${index + 1}_${target}`)
    if (input) {
      input.focus()
    }
  }
}

/*
Function to execute when primereact Datatable value change
 */
export const onValueChange = (value: any[]) => {
  document.getElementById('gridCount')!.innerText = String(value?.length)
}

export const handleFocusAndScroll = (
  e: any,
  focus$: EventEmitter<void>,
): void => {
  if (e.key === 'Enter') {
    focus$.emit()
  }
}

export const buildCategories = (options: any[]): string | null => {
  const opts = options.map((val) => val.id)
  return opts ? opts.join('-') : null
}

export const getNestedObject = (obj: any, dotSeparatedKeys?: any) => {
  if (dotSeparatedKeys !== undefined && typeof dotSeparatedKeys !== 'string')
    return undefined
  if (typeof obj !== 'undefined' && typeof dotSeparatedKeys === 'string') {
    // split on ".", "[", "]", "'", """ and filter out empty elements
    const splitRegex = /[.\[\]'"]/g // eslint-disable-line no-useless-escape
    const pathArr = dotSeparatedKeys.split(splitRegex).filter((k) => k !== '')

    // eslint-disable-next-line no-param-reassign, no-confusing-arrow
    obj = pathArr.reduce(
      (o, key) => (o && o[key] !== 'undefined' ? o[key] : undefined),
      obj,
    )
  }
  return obj
}

export const numberFormatter = (number?: string | number) => {
  return number
    ? String(number).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
    : '-'
}

export const formatNumber = (number: number, locale?: string) => {
  if (locale === 'fr') {
    return number.toLocaleString('fr-FR')
  }

  return number.toLocaleString('en-GB')
}

export const round = (value?: number) => {
  if (!value) return 0

  return value.toFixed(2)
}

export function removeEmptyFields(data: any) {
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] == null) {
      delete data[key]
    }
  })
}

export const emptyStringToNull = (v: string) =>
  v === '' || Number.isNaN(v) ? undefined : v

export async function getConfiguration() {
  const { data } = await axios.get<TConfiguration>('/configuration.json')

  return data
}

export const extractNodeFromEdges = (edges: any[]) => {
  return _.transform(edges, function (result: any[], value) {
    result.push(value.node)
  })
}

export const setOffcanvasSize = (size: any) => {
  // set drawer size
  const root = document.documentElement
  root.style.setProperty('--offcanvas-width', size)
}

export const toCurrency = (number: number) => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    // currency: "SEK"
  })

  return number ? formatter.format(number) : number
}

// write a function to cut a text to a specific length
export const cutText = (text: string, length: number) => {
  if (!text || text.length <= length) {
    return text
  }
  return text.substring(0, length) + '...'
}

export const focusArrayField = (
  fields: any[],
  fieldName: string,
  ref: RefObject<HTMLSpanElement>,
  arrayName: string = 'items',
) => {
  const { run: focusField } = useDebounceFn(
    () => {
      // const keys = getValues('items');
      const input = document.getElementById(
        `${arrayName}.${fields.length - 1}.${fieldName}`,
      )
      input?.focus()
      ref.current?.scrollIntoView(true)
    },
    {
      wait: 500,
    },
  )

  return focusField
}

export const computeTotalFn = (
  fields: any[],
  field1: string,
  field2: string,
  callback?: Function,
) => {
  if (fields.length > 0 && fields[0]) {
    const totals = fields
      .filter((item: any) => item !== undefined)
      .filter(
        (item: any) => parseFloat(item[field1]) && parseFloat(item[field2]),
      )
      .map(
        (item: any) =>
          parseFloat(item[field1]) * parseFloat(item[field2]) -
          parseFloat(item['discount'] || 0),
      )

    const total =
      totals.length !== 0 ? totals.reduce((a: number, b: number) => a + b) : 0

    callback?.(total)
  } else {
    callback?.(0)
  }
}

export const computePartialTotalFn = (
  items: any[],
  field1: string,
  field2: string,
  index: number,
  callback: Function,
) => {
  const total =
    items[index][field1] * items[index][field2] -
    parseFloat(items[index]['discount'] || 0)
  // const total = getValues(`items.${index}.${unitPrice}`) * (getValues(`items.${index}.quantity`));

  callback(`items.${index}.total`, total)
}

export const computeCommonTotal = (items: any[], callback?: Function) => {
  computeTotalFn(items, 'unitPrice', 'quantity', callback)
}

export const computeCommonPartialTotal = (
  items: any[],
  index: number,
  callback: Function,
) => {
  computePartialTotalFn(items, 'unitPrice', 'quantity', index, callback)
}

export const addThousandSeparator = (num: string, sep: string = ' ') =>
  num.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
const removeThousandSeparator = (str: string, sep: string = '') =>
  str.replace(/,(?=\d{3})/g, '')

export const removeNonNumeric = (num: string) => num.replace(/[^0-9]/g, '')

const customFilter = (option: any, searchText: string) => {
  if (
    option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
    option.data.value.toLowerCase().includes(searchText.toLowerCase())
  ) {
    return true
  } else {
    return false
  }
}

export const computePayrollPartialTotalFn = (
  items: any[],
  // field1: string,
  // field2: string,
  index: number,
  arrayName: string,
  callback: Function,
) => {
  const total = (items[index]['base'] * items[index]['rate']) / 100
  // const total = getValues(`items.${index}.${unitPrice}`) * (getValues(`items.${index}.quantity`));

  callback(`${arrayName}.${index}.total`, total)
}

export const computePayrollTotalFn = (
  fields: any[],
  // field1: string,
  // field2: string,
  callback?: Function,
) => {
  if (fields && fields[0]) {
    const totals = fields
      .filter((item: any) => item !== undefined)
      .filter(
        (item: any) => parseFloat(item['base']) && parseFloat(item['rate']),
      )
      .map(
        (item: any) =>
          (parseFloat(item['base']) * parseFloat(item['rate'])) / 100,
      )

    const total =
      totals.length !== 0 ? totals.reduce((a: number, b: number) => a + b) : 0

    callback?.(total)
  } else {
    callback?.(0)
  }
}

export const computeTaxablePayrollTotalFn = (
  fields: any[],
  // field1: string,
  // field2: string,
  callback?: Function,
) => {
  if (fields && fields[0]) {
    const totals = fields
      .filter((item: any) => item !== undefined)
      .filter(
        (item: any) =>
          parseFloat(item['base']) &&
          parseFloat(item['rate']) &&
          item.isTaxable,
      )
      .map(
        (item: any) =>
          (parseFloat(item['base']) * parseFloat(item['rate'])) / 100,
      )

    const total =
      totals.length !== 0 ? totals.reduce((a: number, b: number) => a + b) : 0

    callback?.(total)
  } else {
    callback?.(0)
  }
}

/* export const showDeleteConfirm = async (t: any, callback: any) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: t("label.confirmation").toString(),
    text: t("label.onFormDeleteMany").toString(),
    cancelButtonText: t("label.no").toString(),
    //cancelButtonColor: "#2f8724",
    showCancelButton: true,
    confirmButtonText: t("label.yes").toString(),
    padding: "2em",
    customClass: {
      cancelButton: "bg-red-800 text-red-600",
      confirmButton: "bg-primary",
      denyButton: "bg-red-800",
    },
    target: ".v-application",
  });

  if (isConfirmed) {
    callback();
  }
}; */

export const toNumber = (value: string | number | null): number => {
  if (value === null) {
    return 0
  }
  if (typeof value === 'string') {
    return Number(value.replace(/\s/g, ''))
  }

  return value
}

export const buildPartialFilters = (
  options: any[],
  id: string,
): string | null => {
  const opts = options.map((val) => val[id])
  return opts ? opts.join('-') : null
}

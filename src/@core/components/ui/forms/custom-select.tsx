import React, { Component, cloneElement, Fragment, Suspense } from 'react'
import Select from 'react-select'
import type { StylesConfig } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { selectThemeColors } from '@/utils/Utils'
import cs from 'classnames'
import { enhancedStyles } from '@/@core/components/select/select.style'

export interface MySelectProps {
  value?: any
  loading?: boolean
  options?: any
  styles?: any
  form?: React.ReactElement
  modalWidth?: string
  formId?: string
  optionLabel?: string
  onChange: (value: any) => void
  modalClassName?: string
  error?: boolean
  formTitle?: string
  ref?: any
  placeholder?: string
  isClearable?: boolean
  isMulti?: boolean
  isDisabled?: boolean
  autoFocus?: boolean
  className?: string
  classNamePrefix?: string
  [key: string]: any
}

interface MySelectState {
  selectValue: any
  visible: boolean
}

// Props to exclude from spreading to Select
const EXCLUDED_PROPS = new Set([
  'value',
  'onChange',
  'form',
  'modalClassName',
  'modalWidth',
  'formId',
  'optionLabel',
  'error',
  'formTitle',
  'ref',
  'loading',
  'styles',
])

class MySelect extends Component<MySelectProps, MySelectState> {
  constructor(props: MySelectProps) {
    super(props)

    this.state = {
      selectValue: null,
      visible: false,
    }
  }

  getMergedStyles = () => {
    const { styles, error } = this.props
    const baseControl = styles?.control || enhancedStyles.control

    const merged: StylesConfig<Record<string, any>, boolean> = {
      ...enhancedStyles,
      ...(styles || {}),
    }

    if (error) {
      merged.control = (provided: any, state: any) => ({
        ...(baseControl ? baseControl(provided, state) : provided),
        borderColor: '#ea5455',
        boxShadow: state.isFocused
          ? '0 0 0 3px rgba(234, 84, 85, 0.1)'
          : 'none',
        '&:hover': {
          borderColor: '#ea5455',
        },
      })
    }

    return merged
  }

  handleChange = (value: any) => {
    if (value && value.addButton) {
      this.setState({ visible: true })
    } else {
      this.setState({ selectValue: value })
      this.props.onChange(value)
    }
  }

  getSelectProps() {
    const { props } = this
    const selectProps: Record<string, any> = {}

    // Only spread non-excluded props
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key) && !EXCLUDED_PROPS.has(key)) {
        selectProps[key] = props[key]
      }
    }

    return selectProps
  }

  render() {
    const { props, state } = this
    const buttonOption = {
      addButton: -1,
      [props.optionLabel || 'label']: 'Ajouter',
    }

    const options =
      props.form && props.options
        ? [buttonOption, ...props.options]
        : props.options

    return (
      <Fragment>
        {/* @ts-ignore desc */}
        <Select
          placeholder="Sélectionnez"
          isClearable
          theme={selectThemeColors}
          className={cs('react-select', {
            'is-invalid': props.error,
          })}
          {...this.getSelectProps()}
          options={options}
          onChange={this.handleChange}
          value={props.value ?? state.selectValue}
          menuPortalTarget={document.body}
          styles={this.getMergedStyles()}
          classNamePrefix="select"
        />
        <Modal
          isOpen={state.visible}
          onClosed={() => this.setState({ visible: false })}
          className={props.modalClassName || 'modal-lg'}
          unmountOnClose
          zIndex="1060"
        >
          <ModalHeader
            tag="h2"
            toggle={() => this.setState({ visible: false })}
            className={cs('text-2xl font-bold', {
              'bg-transparent': props.formTitle == null,
            })}
          >
            {props.formTitle}
          </ModalHeader>
          <ModalBody>
            <Suspense>
              {props.form &&
                cloneElement(props.form, {
                  popover: true,
                  onModalClose: () => this.setState({ visible: false }),
                })}
            </Suspense>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default MySelect

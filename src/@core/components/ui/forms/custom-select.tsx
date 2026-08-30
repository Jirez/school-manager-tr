import React, { Component, cloneElement, Fragment, Suspense } from 'react'
import Select from 'react-select'
import type { Props, StylesConfig } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { selectThemeColors } from '@/utils/Utils'
import cs from 'classnames'
import { enhancedStyles } from '@/@core/components/select/select.style'

// @ts-ignore desc
export interface MySelectProps extends Props<{ [key: string]: any }, boolean> {
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
}

interface MySelectState {
  selectValue: any
  visible: boolean
}

class MySelect extends Component<MySelectProps, MySelectState> {
  mergedStyles: StylesConfig<Record<string, any>, boolean>
  constructor(props: any) {
    super(props)

    this.state = {
      selectValue: null,
      visible: false,
    }

    this.mergedStyles = this.props.styles
      ? { ...enhancedStyles, ...this.props.styles }
      : enhancedStyles

    // Override border color for error state
    if (this.props.error && true) {
      this.mergedStyles.control = (provided: any, state: any) => ({
        ...enhancedStyles.control!(provided, state),
        borderColor: state.isFocused ? '#ea5455' : '#ea5455',
        boxShadow: state.isFocused
          ? '0 0 0 3px rgba(234, 84, 85, 0.1)'
          : 'none',
        '&:hover': {
          borderColor: '#ea5455',
        },
      })
    }
  }

  handleChange = (value: any) => {
    if (value && value.addButton) {
      this.setState({ visible: true })
    } else {
      this.setState({ selectValue: value })
      this.props.onChange(value)
    }
  }

  render() {
    const buttonOption = {
      addButton: -1,
      [this.props.optionLabel!]: 'Ajouter',
    }

    return (
      <Fragment>
        {/* @ts-ignore desc */}
        <Select
          placeholder="Sélectionnez"
          isClearable
          // theme={this.props.error ? selectThemeErrorColors : selectThemeColors}
          theme={selectThemeColors}
          className={cs('react-select', {
            'is-invalid': this.props.error,
          })}
          {...this.props}
          options={
            this.props.form && this.props.options
              ? [buttonOption, ...this.props.options]
              : this.props.options
          }
          onChange={this.handleChange}
          value={this.props.value || this.state.selectValue}
          // value={this.props.reset ? null : this.props.value || this.state.selectValue || this.props.initialValue}
          // styles={customStyles}
          /* styles={{
                        // Fixes the overlapping problem of the component
                        menu: provided => ({ ...provided, zIndex: 9999 })
                    }}*/
          menuPortalTarget={document.body}
          styles={this.mergedStyles}
          // classNamePrefix="my-className-prefix"
          classNamePrefix="select"
          // ref={this.ref}
        />
        <Modal
          // width={this.props.modalWidth ? this.props.modalWidth: 520}
          isOpen={this.state.visible}
          onClosed={() => this.setState({ visible: false })}
          className={`${
            this.props.modalClassName ? this.props.modalClassName : 'modal-lg'
          }`}
          unmountOnClose
          zIndex="1060"
          // okText="Ajouter"
          // onOk={() => document.getElementById(this.props.formId!)?.click()}
        >
          <ModalHeader
            tag="h2"
            toggle={() => this.setState({ visible: false })}
            // className='bg-transparent'
            className={cs('text-2xl font-bold', {
              'bg-transparent': this.props.formTitle == null,
            })}
          >
            {this.props.formTitle}
          </ModalHeader>
          <ModalBody>
            <Suspense>
              {this.props.form &&
                cloneElement(this.props.form, {
                  popover: true,
                  onModalClose: () => this.setState({ visible: false }),
                })}
            </Suspense>
          </ModalBody>
          {/* <ModalFooter>
                        <Button color='primary' onClick={() => document.getElementById(this.props.formId!)?.click()}>
                            Ajouter
                        </Button>
                    </ModalFooter>*/}
        </Modal>
      </Fragment>
    )
  }
}

export default MySelect

import type { StylesConfig } from 'react-select'

export const myCustomStyles = {
  container: (provided: any) => ({
    ...provided,
    // width: '250px',
    // border: '1px solid red',
    // fontWeight: 500,
    borderRadius: 0,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    // height: '13px',
    // width: 245,
    minHeight: 35,
    // border: '1px solid #d9d9d9',
    // padding: 0,
    borderRadius: 2,
    zIndex: 1000,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    height: 20,
    paddingTop: 0,
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    // width: '1000px',
    fontWeight: 400,
    color: '#545454',
    zIndex: 10600,
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    // minHeight: '1px',
    paddingTop: 0,
    height: 20,
  }),
  input: (provided: any) => ({
    ...provided,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'rgba(0,0,0,.65)',
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
}

export const enhancedStyles: StylesConfig<Record<string, any>, boolean> = {
  ...myCustomStyles,
  container: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '36px',
    borderRadius: '8px',
    borderColor: state.isFocused
      ? '#7367f0'
      : state.hasValue
        ? '#d0d7de'
        : '#d0d7de',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(115, 103, 240, 0.1)' : 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: state.isFocused ? '#7367f0' : '#a8b0b8',
    },
    cursor: 'pointer',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '2px 8px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#6c757d',
    fontSize: '0.95rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#2c3e50',
    fontSize: '0.95rem',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    marginTop: '4px',
    zIndex: 106000,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '4px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '6px',
    margin: '2px 0',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: state.isSelected
      ? '#7367f0'
      : state.isFocused
        ? 'rgba(115, 103, 240, 0.1)'
        : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : state.isFocused
        ? '#7367f0'
        : '#2c3e50',
    '&:active': {
      backgroundColor: state.isSelected
        ? '#7367f0'
        : 'rgba(115, 103, 240, 0.15)',
    },
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '4px 8px',
    color: state.isFocused ? '#7367f0' : '#6c757d',
    transition: 'color 0.2s ease, transform 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': {
      color: '#7367f0',
    },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    padding: '4px 8px',
    color: '#6c757d',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#ea5455',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

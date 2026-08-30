import React from 'react'

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | any
}
export const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, ...rest }, ref) => {
    return (
      <label className="group flex items-center justify-end text-skin-base text-base cursor-pointer transition-all hover:text-opacity-80 border-b border-skin-base py-3.5 last:border-b-0 last:pb-0 first:pt-0">
        <span className="me-3.5p -mt-0.5p w-full">{label ? label : label}</span>
        <input
          type="checkbox"
          className="form-checkbox text-skin-yellow w-[18px] h-[18px] border-1 border-skin-four rounded-full cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-skin-yellow focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-skin-yellow hover:checked:bg-skin-yellow"
          ref={ref}
          {...rest}
        />
      </label>
    )
  },
)

CheckBox.displayName = 'CheckBox'

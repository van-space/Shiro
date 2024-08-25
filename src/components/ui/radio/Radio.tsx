import clsx from 'clsx'
import type {FC} from 'react';
import {  useContext,useId } from 'react'

import { RadioGroupContext } from './RadioGroup'

export const Radio: FC<{
  label: string
  disabled?: boolean
  value: string
}> = ({ label, disabled: propDisabled, value }) => {
  const {
    disabled: groupDisabled,
    onValueChange,
    value: contextValue,
  } = useContext(RadioGroupContext)
  const checked = contextValue === value
  const disabled = groupDisabled || propDisabled
  const id = useId()
  return (
    <div className={clsx('flex items-center gap-2')}>
      <input
        id={id}
        onChange={(e) => {
          if (disabled) return
          onValueChange?.(value)
        }}
        className={clsx(
          'radio-accent radio radio-xs',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        type="radio"
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

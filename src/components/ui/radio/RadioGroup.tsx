'use client'
import type {FC, ReactNode} from 'react';
import {
  createContext,
  useState
} from 'react'

export const RadioGroupContext = createContext<{
  disabled?: boolean
  onValueChange?: (value: string) => void
  value: string
}>({
  disabled: false,
  onValueChange: () => {},
  value: '',
})
export const RadioGroup: FC<{
  defaultValue: string
  disabled?: boolean
  onValueChange?: (value: any) => void
  children: ReactNode
}> = ({ defaultValue, disabled, onValueChange, children }) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        disabled,
        onValueChange: (v) => {
          setValue(v)
          onValueChange?.(v)
        },
      }}
    >
      <div className="mt-4 grid w-full grid-cols-2 gap-2 px-2">{children}</div>
    </RadioGroupContext.Provider>
  )
}

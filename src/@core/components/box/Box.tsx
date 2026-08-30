import {
  BoxContent,
  BoxDescription,
  BoxHead,
  BoxInfo,
  BoxMiniContent,
  BoxMiniHead,
  BoxMiniInfo,
  BoxMiniWrapper,
  BoxWrapper,
} from './Box.style'
import type { FC, ReactNode } from 'react'

interface BoxProps {
  title: string | ReactNode
  description?: string | ReactNode
  // content: string | ReactNode
  children: any
}

export const Box: FC<BoxProps> = ({ title, description, children }) => {
  return (
    <BoxWrapper>
      <BoxInfo>
        <BoxHead>{title}</BoxHead>
        <BoxDescription>{description}</BoxDescription>
      </BoxInfo>
      <BoxContent>{children}</BoxContent>
    </BoxWrapper>
  )
}

export const BoxMini: FC<BoxProps> = ({ title, description, children }) => {
  return (
    <BoxMiniWrapper>
      <BoxMiniInfo>
        <BoxMiniHead>{title}</BoxMiniHead>
        <BoxDescription>{description}</BoxDescription>
      </BoxMiniInfo>
      <BoxMiniContent>{children}</BoxMiniContent>
    </BoxMiniWrapper>
  )
}

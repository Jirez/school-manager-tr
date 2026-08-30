import type { FC } from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'motion/react'

interface ToggleOptionProps {
  icon: React.ReactNode
  title: string
  description: string
  isActive: boolean
  children: React.ReactNode
}

const OptionCard = styled(motion.div)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.$isActive
      ? css`
          background: linear-gradient(
            135deg,
            rgba(47, 135, 36, 0.08) 0%,
            rgba(47, 135, 36, 0.03) 100%
          );
          border-color: rgba(47, 135, 36, 0.2);
          box-shadow: 0 4px 12px rgba(47, 135, 36, 0.05);
        `
      : css`
          background: rgba(180, 183, 189, 0.05);
          border-color: rgba(180, 183, 189, 0.1);
        `}

  .dark-layout & {
    ${(props) =>
      props.$isActive
        ? css`
            background: linear-gradient(
              135deg,
              rgba(47, 135, 36, 0.15) 0%,
              rgba(47, 135, 36, 0.05) 100%
            );
            border-color: rgba(47, 135, 36, 0.3);
          `
        : css`
            background: rgba(255, 255, 255, 0.03);
            border-color: rgba(255, 255, 255, 0.08);
          `}
  }

  &:hover {
    ${(props) =>
      props.$isActive
        ? css`
            border-color: rgba(47, 135, 36, 0.4);
            box-shadow: 0 6px 16px rgba(47, 135, 36, 0.1);
          `
        : css`
            background: rgba(180, 183, 189, 0.1);
            border-color: rgba(180, 183, 189, 0.2);
          `}
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const IconBox = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  transition: all 0.3s ease;

  ${(props) =>
    props.$isActive
      ? css`
          background: linear-gradient(135deg, #2f8724 0%, #45a039 100%);
          color: white;
          box-shadow: 0 4px 8px rgba(47, 135, 36, 0.3);
        `
      : css`
          background: rgba(180, 183, 189, 0.15);
          color: #6e6b7b;

          .dark-layout & {
            background: rgba(255, 255, 255, 0.1);
            color: #b4b7bd;
          }
        `}
  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2.25px;
  }
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const DescriptionText = styled.p`
  margin: 0.1rem 0 0 0;
  font-size: 0.775rem;
  color: #6e6b7b;
  line-height: 1.4;

  .dark-layout & {
    color: #b4b7bd;
  }
`

// Toggle Option Component
const ToggleOption: FC<ToggleOptionProps> = ({
  icon,
  title,
  description,
  isActive,
  children,
}) => (
  <OptionCard $isActive={isActive} whileTap={{ scale: 0.99 }}>
    <Content>
      <IconBox $isActive={isActive}>{icon}</IconBox>
      <TextGroup>
        <Title>{title}</Title>
        <DescriptionText>{description}</DescriptionText>
      </TextGroup>
    </Content>
    {children}
  </OptionCard>
)

export default ToggleOption

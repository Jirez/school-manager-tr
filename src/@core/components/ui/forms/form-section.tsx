import type { FC } from 'react'
import styled from 'styled-components'
import { motion } from 'motion/react'

const StyledSection = styled(motion.div)`
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(115, 103, 240, 0.15);
  padding: 0.95rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
    border-color: rgba(47, 135, 36, 0.2); // primary color rgba
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.15);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border-color: rgba(47, 135, 36, 0.3);
    }
  }
`

const HeaderContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: -1rem -1rem 1rem -1rem;
  padding: 0.75rem 1rem;
  background: ${({ $color }) => `${$color}0a`};
  border-bottom: 1px solid rgba(115, 103, 240, 0.15);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  .dark-layout & {
    background: ${({ $color }) => `${$color}14`};
    border-bottom-color: rgba(115, 103, 240, 0.15);
  }
`

const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ $color }) => `linear-gradient(
    135deg,
    ${$color}26 0%,
    ${$color}0d 100%
  )`};
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  box-shadow: 0 4px 10px ${({ $color }) => `${$color}1a`};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.25px;
  }
`

const TitleContent = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.01em;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const Description = styled.p`
  font-size: 0.8rem;
  color: #6e6b7b;
  margin: 0.15rem 0 0 0;
  line-height: 1.4;

  .dark-layout & {
    color: #b4b7bd;
  }
`

interface FormSectionProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  color?: string
}

// Form Section Card Component with integrated header
const FormSection: FC<FormSectionProps> = ({
  children,
  className = '',
  icon,
  title,
  description,
  color = '#7367f0',
}) => (
  <StyledSection
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {title && (
      <HeaderContainer $color={color}>
        {icon && <IconWrapper $color={color}>{icon}</IconWrapper>}
        <TitleContent>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </TitleContent>
      </HeaderContainer>
    )}
    {children}
  </StyledSection>
)

export default FormSection

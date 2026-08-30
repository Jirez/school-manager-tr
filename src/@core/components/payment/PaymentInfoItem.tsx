import type { LucideIcon } from 'lucide-react'
import { styled } from 'styled-components'

interface PaymentInfoItemProps {
  amount: number | string
  label: string
  count: number
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

const Card = styled.div<{
  $color: string
  $bgColor: string
  $borderColor: string
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: ${({ $bgColor }) => $bgColor};
  border: 2px solid ${({ $borderColor }) => $borderColor};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${({ $color }) => $color};
    background: ${({ $bgColor, $color }) =>
      $bgColor.replace('0.1', '0.15') || `rgba(${$color}, 0.15)`};
  }

  .dark-layout & {
    background: ${({ $bgColor }) => $bgColor.replace('0.1', '0.15')};
    border-color: ${({ $borderColor }) => $borderColor.replace('0.3', '0.4')};

    &:hover {
      background: ${({ $bgColor }) => $bgColor.replace('0.1', '0.2')};
      border-color: ${({ $color }) => $color};
    }
  }
`

const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    //display: none;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 0.25rem;
`

const Amount = styled.span<{ $color: string }>`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dark-layout & {
    color: ${({ $color }) => $color};
  }
`

const Label = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ $color }) => $color};
  opacity: 0.8;

  .dark-layout & {
    opacity: 0.9;
  }
`

const Count = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-top: 0.125rem;

  .dark-layout & {
    color: #9ca3af;
  }
`

const PaymentInfoItem: React.FC<PaymentInfoItemProps> = ({
  amount,
  label,
  count,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <Card $color={color} $bgColor={bgColor} $borderColor={borderColor}>
      <IconWrapper $color={color}>
        <Icon size={18} />
      </IconWrapper>
      <Content>
        <Amount $color={color}>{amount} FCFA</Amount>
        <Label $color={color}>{label}</Label>
        <Count>
          {count} {label}
        </Count>
      </Content>
    </Card>
  )
}

export default PaymentInfoItem

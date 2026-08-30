import type { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

type LayoutType = 'horizontal' | 'vertical'
type VariantType = 'bordered' | 'card' | 'simple'
type SizeType = 'sm' | 'md' | 'lg'

interface DescriptionsProps {
  className?: string
  layout?: LayoutType
  variant?: VariantType
  size?: SizeType
  title?: string
  columns?: number
  children: ReactNode
}

interface DescriptionItemProps {
  title?: string
  icon?: ReactNode
  span?: number
  children: ReactNode
}

const sizeStyles = {
  sm: css`
    --desc-padding: 0.5rem 0.75rem;
    --desc-title-size: 0.75rem;
    --desc-content-size: 0.85rem;
    --desc-gap: 0.25rem;
  `,
  md: css`
    --desc-padding: 0.75rem 1rem;
    --desc-title-size: 0.8rem;
    --desc-content-size: 0.95rem;
    --desc-gap: 0.375rem;
  `,
  lg: css`
    --desc-padding: 1rem 1.25rem;
    --desc-title-size: 0.85rem;
    --desc-content-size: 1rem;
    --desc-gap: 0.5rem;
  `,
}

const Container = styled.div<{
  $variant: VariantType
  $size: SizeType
}>`
  width: 100%;
  ${({ $size }) => sizeStyles[$size]}

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(115, 103, 240, 0.1);
      overflow: hidden;

      .dark-layout & {
        background: #283046;
        border-color: rgba(115, 103, 240, 0.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    `}

  ${({ $variant }) =>
    $variant === 'bordered' &&
    css`
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;

      .dark-layout & {
        border-color: #374151;
      }
    `}
`

const Header = styled.div<{ $variant: VariantType }>`
  display: flex;
  align-items: center;
  padding: var(--desc-padding);
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid
    ${({ $variant }) =>
      $variant === 'simple' ? 'transparent' : 'rgba(115, 103, 240, 0.15)'};

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.08) 0%,
        rgba(115, 103, 240, 0.03) 100%
      );
    `}

  .dark-layout & {
    color: #e4e6eb;
    border-bottom-color: ${({ $variant }) =>
      $variant === 'simple' ? 'transparent' : 'rgba(115, 103, 240, 0.25)'};

    ${({ $variant }) =>
      $variant === 'card' &&
      css`
        background: rgba(115, 103, 240, 0.15);
      `}
  }
`

const Grid = styled.div<{
  $layout: LayoutType
  $columns: number
  $variant: VariantType
}>`
  display: grid;
  grid-template-columns: ${({ $layout, $columns }) =>
    $layout === 'vertical' ? '1fr' : `repeat(${$columns}, 1fr)`};
  width: 100%;

  ${({ $variant }) =>
    $variant !== 'simple' &&
    css`
      & > * {
        border-bottom: 1px solid #e5e7eb;

        .dark-layout & {
          border-bottom-color: #374151;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    `}

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ItemContainer = styled.div<{
  $span: number
  $variant: VariantType
}>`
  display: flex;
  flex-direction: column;
  gap: var(--desc-gap);
  padding: var(--desc-padding);
  grid-column: span ${({ $span }) => $span};
  transition: background-color 0.2s ease;

  ${({ $variant }) =>
    $variant !== 'simple' &&
    css`
      border-right: 1px solid #e5e7eb;

      .dark-layout & {
        border-right-color: #374151;
      }

      &:last-child {
        border-right: none;
      }
    `}

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      &:hover {
        background: rgba(115, 103, 240, 0.03);

        .dark-layout & {
          background: rgba(115, 103, 240, 0.08);
        }
      }
    `}

  @media (max-width: 768px) {
    grid-column: span 1;
    border-right: none;
  }
`

const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--desc-title-size);
  font-weight: 500;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  svg {
    color: #7367f0;
    flex-shrink: 0;
  }

  .dark-layout & {
    color: #9ca3af;
  }
`

const ItemContent = styled.div`
  font-size: var(--desc-content-size);
  font-weight: 500;
  color: #2c3e50;
  word-break: break-word;
  line-height: 1.5;

  .dark-layout & {
    color: #e4e6eb;
  }

  &:empty::before {
    content: '—';
    color: #adb5bd;

    .dark-layout & {
      color: #6c757d;
    }
  }
`

export const Descriptions: FC<DescriptionsProps> = ({
  className,
  layout = 'horizontal',
  variant = 'bordered',
  size = 'md',
  title,
  columns = 2,
  children,
}) => {
  return (
    <Container className={className} $variant={variant} $size={size}>
      {title && <Header $variant={variant}>{title}</Header>}
      <Grid $layout={layout} $columns={columns} $variant={variant}>
        {children}
      </Grid>
    </Container>
  )
}

export const DescriptionItem: FC<DescriptionItemProps> = ({
  children,
  title,
  icon,
  span = 1,
}) => {
  return (
    <ItemContainer $span={span} $variant="bordered">
      {title && (
        <ItemTitle>
          {icon}
          {title}
        </ItemTitle>
      )}
      <ItemContent>{children}</ItemContent>
    </ItemContainer>
  )
}

// Context-aware DescriptionItem that inherits variant from parent
// For advanced usage, you can wrap items with this context
export default Descriptions

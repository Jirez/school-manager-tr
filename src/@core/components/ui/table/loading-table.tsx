import { css, keyframes, styled } from 'styled-components'

export interface LoadingTableProps {
  /** Minimum height of the table card. */
  minHeight?: number
  /** Number of placeholder rows. */
  rows?: number
  /** Number of placeholder columns. */
  columns?: number
  /** Show the circular avatar placeholder in the first column. */
  showAvatar?: boolean
  /** Skeleton animation style. */
  animation?: 'wave' | 'pulse' | false
  /** Accessible label announced while loading. */
  label?: string
  className?: string
}

const shimmer = keyframes`
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const TableCard = styled.div<{ $minHeight: number }>`
  min-height: ${({ $minHeight }) => `${$minHeight}px`};
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(255, 255, 255, 0.97) 100%
  );
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.04);
  animation: ${fadeIn} 0.3s ease-out;

  .dark-layout & {
    border-color: rgba(255, 255, 255, 0.06);
    background: linear-gradient(
      135deg,
      rgba(30, 37, 59, 0.85) 0%,
      rgba(30, 37, 59, 0.97) 100%
    );
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
  }
`

const ScrollArea = styled.div`
  width: 100%;
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    background: rgba(15, 23, 42, 0.02);

    .dark-layout & {
      background: rgba(255, 255, 255, 0.02);
    }

    th {
      padding: 20px 24px;
      border-bottom: 2px solid rgba(15, 23, 42, 0.05);
      text-align: left;

      .dark-layout & {
        border-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  tbody {
    tr {
      &:not(:last-child) td {
        border-bottom: 1px solid rgba(15, 23, 42, 0.04);

        .dark-layout & {
          border-color: rgba(255, 255, 255, 0.04);
        }
      }
    }

    td {
      padding: 18px 24px;
      vertical-align: middle;
    }
  }

  @media (max-width: 640px) {
    thead th,
    tbody td {
      padding: 14px 16px;
    }
  }
`

const CellContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`

const Lines = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`

const Bone = styled.span<{
  $width: string
  $height: number
  $radius?: number
  $animation: LoadingTableProps['animation']
  $delay?: number
}>`
  display: block;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => `${$height}px`};
  flex-shrink: 0;
  border-radius: ${({ $radius = 4 }) => `${$radius}px`};
  background: linear-gradient(
    90deg,
    rgba(47, 135, 36, 0.07) 25%,
    rgba(47, 135, 36, 0.16) 50%,
    rgba(47, 135, 36, 0.07) 75%
  );
  background-size: 200% 100%;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};

  ${({ $animation }) =>
    $animation === 'wave' &&
    css`
      animation-name: ${shimmer};
      animation-duration: 1.6s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    `}

  ${({ $animation }) =>
    $animation === 'pulse' &&
    css`
      animation-name: ${pulse};
      animation-duration: 1.5s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    `}

  ${({ $animation }) =>
    $animation === false &&
    `
      animation: none;
    `}

  .dark-layout & {
    background: linear-gradient(
      90deg,
      rgba(167, 139, 250, 0.09) 25%,
      rgba(167, 139, 250, 0.2) 50%,
      rgba(167, 139, 250, 0.09) 75%
    );
    background-size: 200% 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const HEADER_WIDTHS = [82, 58, 74, 64, 88, 56, 70]
const CONTENT_WIDTHS = [80, 62, 74, 58, 68, 52, 72]
const SECONDARY_WIDTHS = [42, 36, 48, 40, 44, 32, 38]

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Math.trunc(value), min), max)

export function LoadingTable({
  minHeight = 450,
  rows = 6,
  columns = 5,
  showAvatar = true,
  animation = 'wave',
  label = 'Loading',
  className,
}: LoadingTableProps) {
  const rowCount = clamp(rows, 1, 50)
  const columnCount = clamp(columns, 1, 12)

  return (
    <TableCard
      $minHeight={minHeight}
      className={className}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      <ScrollArea>
        <StyledTable aria-hidden="true">
          <thead>
            <tr>
              {Array.from({ length: columnCount }).map((_, columnIndex) => (
                <th key={columnIndex} scope="col">
                  <Bone
                    $width={`${HEADER_WIDTHS[columnIndex % HEADER_WIDTHS.length]}%`}
                    $height={12}
                    $radius={4}
                    $animation={animation}
                    $delay={columnIndex * 60}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columnCount }).map((__, columnIndex) => {
                  const isFirst = columnIndex === 0
                  const delay = rowIndex * 90 + columnIndex * 45

                  return (
                    <td key={columnIndex}>
                      {isFirst && showAvatar ? (
                        <CellContent>
                          <Bone
                            $width="38px"
                            $height={38}
                            $radius={19}
                            $animation={animation}
                            $delay={delay}
                          />
                          <Lines>
                            <Bone
                              $width={`${CONTENT_WIDTHS[columnIndex % CONTENT_WIDTHS.length]}%`}
                              $height={12}
                              $animation={animation}
                              $delay={delay + 40}
                            />
                            <Bone
                              $width={`${SECONDARY_WIDTHS[columnIndex % SECONDARY_WIDTHS.length]}%`}
                              $height={8}
                              $radius={2}
                              $animation={animation}
                              $delay={delay + 80}
                            />
                          </Lines>
                        </CellContent>
                      ) : (
                        <Bone
                          $width={`${CONTENT_WIDTHS[columnIndex % CONTENT_WIDTHS.length]}%`}
                          $height={12}
                          $animation={animation}
                          $delay={delay}
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </ScrollArea>
    </TableCard>
  )
}

export default LoadingTable

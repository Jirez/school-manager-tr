import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { BookOpen, Layers, Building2, CheckCircle2, Hash } from 'lucide-react'
import styled from 'styled-components'

import { showDisplayedRowCount } from '@/utils/helpers'
import type { Subject } from './Subject.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(115, 103, 240, 0.08);
  color: #7367f0;
  flex-shrink: 0;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.12);
    color: #9e95f5;
  }
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const PrimaryText = styled.span`
  font-weight: 600;
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.2;

  .dark-layout & {
    color: #e2e8f0;
  }
`

const SecondaryText = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;

  .dark-layout & {
    color: #94a3b8;
  }
`

const StyledBadge = styled.span<{ $color?: string; $bg?: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => props.$bg || 'rgba(115, 103, 240, 0.08)'};
  color: ${(props) => props.$color || '#7367f0'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const SubjectTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: 'name',
        header: () => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <BookOpen size={14} /> {t('label-name')}
          </div>
        ),
        accessorKey: 'name',
        cell: (info) => (
          <NameContainer>
            <IconWrapper>
              <BookOpen size={16} />
            </IconWrapper>
            <TextContainer>
              <PrimaryText>{info.getValue() as string}</PrimaryText>
              {info.row.original.code && (
                <SecondaryText>
                  <Hash size={10} />
                  {info.row.original.code}
                </SecondaryText>
              )}
            </TextContainer>
          </NameContainer>
        ),
        size: 300,
      },
      {
        id: 'subjectDepartment',
        header: () => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <Building2 size={14} /> {t('label-department')}
          </div>
        ),
        accessorFn: (row) => row.subjectDepartment?.name,
        cell: (info) =>
          info.getValue() ? (
            <StyledBadge $bg="rgba(0, 207, 232, 0.12)" $color="#00cfe8">
              {info.getValue() as string}
            </StyledBadge>
          ) : (
            <span className="text-gray-400">-</span>
          ),
        size: 200,
      },
      {
        id: 'schoolSection',
        header: () => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <Layers size={14} /> {t('label-schoolSection')}
          </div>
        ),
        accessorFn: (row) => row.subjectDepartment?.schoolSection?.name,
        cell: (info) =>
          info.getValue() ? (
            <StyledBadge $bg="rgba(255, 159, 67, 0.12)" $color="#ff9f43">
              {info.getValue() as string}
            </StyledBadge>
          ) : (
            <span className="text-gray-400">-</span>
          ),
        size: 200,
      },
      {
        id: 'active',
        header: () => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 justify-center">
            <CheckCircle2 size={14} /> {t('label-status')}
          </div>
        ),
        accessorKey: 'active',
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 100,
      },
    ],
    [t],
  )

  return (
    <div className="!text-sm">
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => showDisplayedRowCount(rows)}
        showQuickFilter={true}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        modal={props.modal}
        showCheckbox={false}
        onRowClicked={props.onRowClicked}
        pageSize={15}
        initialFilter={props.initialFilter}
        showAddButton={!!props.onAddButtonClick}
        onAddButtonClick={props.onAddButtonClick}
      />
    </div>
  )
}

export default SubjectTable

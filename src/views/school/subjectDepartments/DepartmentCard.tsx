import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GrEdit } from 'react-icons/gr'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { DepartmentType } from './Department.type'
import SubjectDepartmentDelete from './SubjectDepartmentDelete'
import type { NiceModalHandler } from '@ebay/nice-modal-react'

interface DepartmentCardProps {
  department: DepartmentType
  modal: NiceModalHandler
  onEdit: (department: DepartmentType) => void
}

const DepartmentCard: FC<DepartmentCardProps> = ({
  department,
  modal,
  onEdit,
}) => {
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:!bg-dark2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white m-0">
            {department.name}
          </h3>
          <ActiveRenderer active={department.active} />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{t('label-schoolSection')}: </span>
          {department.schoolSection?.name}
        </div>

        {department.code && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-medium">{t('label-code')}: </span>
            {department.code}
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
        <button
          onClick={() => onEdit(department)}
          className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 shadow-sm"
          title={t('label-update')}
        >
          <GrEdit size={16} />
        </button>

        <SubjectDepartmentDelete
          id={department.id}
          refetch={() => modal.hide()} // This might need adjustment based on how delete works
          // The original delete component likely handles the mutation and refetch logic or takes a callback
        />
      </div>
    </div>
  )
}

export default DepartmentCard

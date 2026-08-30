import { useMemo } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";

import { showDisplayedRowCount } from "@/utils/helpers";
import ActionRenderer from "@/@core/components/base-table/action-renderer";
import ActiveRenderer from "@/@core/components/base-table/active-renderer";
import SchoolYearDelete from "@/views/school/schoolYears/SchoolYearDelete";
import type { SchoolYearType } from "./SchoolYear.type";
import CommonTable from "@/@core/components/react-table/common-react-table";


const SchoolYearTable: FC<CommonTableProps> = (props) => {
    const { t } = useTranslation();

    const columns = useMemo<ColumnDef<SchoolYearType>[]>(() => [
        {
            accessorKey: 'label',
            header: () => t('label-designation')
        },
        {
            accessorKey: 'startDate',
            header: () => t('label-startDate'),
            cell: info => dayjs(info.getValue() as string).format("DD MMM YYYY")
        },
        {
            accessorKey: 'endDate',
            header: () => t('label-endDate'),
            cell: info => dayjs(info.getValue() as string).format("DD MMM YYYY")
        },
        {
            accessorKey: 'current',
            header: () => t('label-default'),
            cell: info => <ActiveRenderer
                active={info.getValue() as boolean}
                activeText="label.yes"
                inactiveText="label.no"
            />
        },
        {
            accessorKey: 'archived',
            header: () => t('label-archived'),
            cell: info => <ActiveRenderer
                active={info.getValue() as boolean}
                activeText="label.yes"
                inactiveText="label.no"
            />
        },
        {
            accessorKey: 'id',
            header: 'Id'
        },
        {
            id: 'actions',
            header: () => t('label-actions'),
            cell: info => <ActionRenderer
                params={info.row.original}
                deleteElement={<SchoolYearDelete />}
                updateElement={<span />}
                formId="schoolYear"
                modal={props.modal}
            />
        }
    ], [t, props.modal])


    return (
        <CommonTable
            data={props.dataSource!}
            columns={columns}
            onModelUpdate={rows => showDisplayedRowCount(rows)}
            showQuickFilter={false}
            onGlobalFilterChanged={props.onGlobalFilterChanged}
        />
    )
}

export default SchoolYearTable;

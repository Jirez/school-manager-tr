import { useModal } from "@ebay/nice-modal-react";
import { useAuthentication } from "@/hooks/useAuthentication";
import Toolbar from "@/@core/components/base-table/toolbar";
import Navs from "@/@core/components/navs/navs";
import { SchoolYearLinks } from "@/navigation/links";
import LiveView from "@/utils/LiveView";
import Scrollbar from "@/@core/components/ui/scrollbar";
import { useTranslation } from "react-i18next";
import SchoolYearModal from "./SchoolYearModal";
import ErrorComponent from "@/@core/components/ui/error-component";
import { SchoolYearCreatedDocument, useSchoolYearsQuery } from "@/gql/graphql";
import { useMount, useTitle } from "ahooks";
import { useTableColumns } from "./schoolYearModel";
import { useTable } from "@/@core/components/react-table/useTable";
import CustomTable from "@/@core/components/react-table/custom-table";
import { useState } from "react";

const SchoolYears = () => {
  const { enterpriseId } = useAuthentication();
  const modal = useModal(SchoolYearModal);
  const { t } = useTranslation();
  useTitle(t("sidebar.school.schoolYears"));
  const [isMount, setIsMount] = useState(false);

  const { data, error, loading, subscribeToMore, refetch } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
    });

  const { columns } = useTableColumns(modal);

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.schoolYears || [],
    columns,
  });

  useMount(() => {
    setIsMount(true);
  });

  if (!isMount) {
    return null;
  }

  if (error) {
    return (
      <div className="flex flex-row items-center">
        <ErrorComponent title={"Erreur"} message={error.message} />
      </div>
    );
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SchoolYearLinks} />
      <Toolbar
        title={t("sidebar.school.schoolYears")}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_schoolYear"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={SchoolYearCreatedDocument}
          data={data}
          loading={loading}
          subscribeToMore={subscribeToMore}
          listVar="schoolYears"
          singleVar="schoolYear"
          sortField="label"
          triggerUpdate={true}
          enterpriseId={enterpriseId}
        >
          {({ schoolYears }) => <CustomTable table={table} modal={modal} />}
        </LiveView>
      </div>
    </Scrollbar>
  );
};

export default SchoolYears;

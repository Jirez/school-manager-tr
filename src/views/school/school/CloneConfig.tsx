import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Calendar } from "react-feather";
import { useAuthentication } from "@/hooks/useAuthentication";
import LiveView from "@/utils/LiveView";
import { formatError } from "@/utils/ErrorHelper";
import PageHeader from "@/@core/components/ui/page-header";
import CustomSelect from "@/@core/components/ui/forms/custom-select";
import { schoolYearOptions } from "@/utils/select/selectComponents";
import Button from "@/@core/components/button";
import { TOAST_OPTIONS } from "@/utils/constants";
import { useCloneConfigMutation, useSchoolYearsQuery, SchoolYearCreatedDocument } from "@/gql/graphql";
import { useTitle } from "ahooks";
import { EmptyState } from "../../report/report.style";

const CloneConfig = () => {
  const { t } = useTranslation();
  useTitle(t("sidebar.school.cloneConfig"));
  const { enterpriseId } = useAuthentication();
  const [currentSchoolYear, setCurrentSchoolYear] = useState<{
    [key: string]: any;
  } | null>(null);
  const [nextSchoolYear, setNextSchoolYear] = useState<{
    [key: string]: any;
  } | null>(null);

  const {
    data: dataSchoolYear,
    loading: loadingSchoolYear,
    subscribeToMore: subscribeToMoreSchoolYear,
  } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: "network-only",
  });

  const [clone, { loading }] = useCloneConfigMutation();

  const handleAction = () => {
    toast.info("Copie des paramètres en cours...");
    const variables = {
      schoolYearId: currentSchoolYear ? Number(currentSchoolYear.id) : -1,
      destSchoolYearId: nextSchoolYear ? Number(nextSchoolYear.id) : -1,
    };

    clone({ variables: { ...variables } })
      .then(async ({ data }) => {
        toast.success("Copie terminée", { ...TOAST_OPTIONS });
      })
      .catch((error) => {
        toast.error(`Copie non effectuée : ${formatError(error)}`);
      });
  };

  return (
    <div className="flex flex-col w-full">
      <div>
        <div className="w-full">
          <PageHeader title={t("sidebar.school.cloneConfig")} />
        </div>

        <div className="w-full">
          {!loadingSchoolYear &&
          (!dataSchoolYear?.schoolYears ||
            dataSchoolYear.schoolYears.length === 0) ? (
            <EmptyState>
              <Calendar />
              <p>
                {t("label-noSchoolYears") || "Aucune année scolaire disponible"}
              </p>
            </EmptyState>
          ) : (
            <div className="row">
              <div className="w-full md:w-4/12 lg:w-3/12">
                <LiveView
                  document={SchoolYearCreatedDocument}
                  singleVar="schoolYear"
                  data={dataSchoolYear}
                  listVar="schoolYears"
                  subscribeToMore={subscribeToMoreSchoolYear}
                  sortField="label"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ schoolYears }) => (
                    <CustomSelect
                      loading={loadingSchoolYear}
                      onChange={(val) => setCurrentSchoolYear(val)}
                      options={schoolYears || undefined}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.id}
                      value={currentSchoolYear}
                      components={{ Option: schoolYearOptions }}
                      // form={<AddClass/>}
                      formId="schoolYear"
                      optionLabel="label"
                      placeholder="Année scolaire en cours"
                    />
                  )}
                </LiveView>
              </div>

              <div className="w-full md:w-4/12 lg:w-3/12">
                <LiveView
                  document={SchoolYearCreatedDocument}
                  singleVar="schoolYear"
                  data={dataSchoolYear}
                  listVar="schoolYears"
                  subscribeToMore={subscribeToMoreSchoolYear}
                  sortField="label"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ schoolYears }) => (
                    <CustomSelect
                      loading={loadingSchoolYear}
                      onChange={(val) => setNextSchoolYear(val)}
                      options={schoolYears || undefined}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.id}
                      value={nextSchoolYear}
                      components={{ Option: schoolYearOptions }}
                      // form={<AddClass/>}
                      formId="schoolYear"
                      optionLabel="label"
                      placeholder="Année scolaire prochaine"
                    />
                  )}
                </LiveView>
              </div>

              <div className="w-full md:w-2/12">
                {currentSchoolYear && nextSchoolYear && (
                  <Button
                    className="round"
                    color="primary"
                    loading={loading}
                    onClick={() => handleAction()}
                  >
                    Copier
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloneConfig;

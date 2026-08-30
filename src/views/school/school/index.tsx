import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";

import { useAuthentication } from "@/hooks/useAuthentication";
import PageHeader from "@/@core/components/ui/page-header";
import SchoolUpdate from "@/views/school/school/SchoolUpdate";
import Loader from "@/@core/components/spinner/loader";
import { useSchoolByIdQuery } from "@/gql/graphql";
import { useTitle } from "ahooks";

const School = () => {
  const { t } = useTranslation();
  const { enterpriseId } = useAuthentication();
  useTitle(t("sidebar.school"));

  const { data, loading } = useSchoolByIdQuery({
    variables: { id: enterpriseId },
  });

  if (loading) return <Loader />;

  const { schools } = data!;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={`${t("sidebar.school")} - ${data?.schools?.id}`} />
      </div>
      <div className="w-full">
        <Card>
          <CardBody>
            <SchoolUpdate school={schools} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default School;

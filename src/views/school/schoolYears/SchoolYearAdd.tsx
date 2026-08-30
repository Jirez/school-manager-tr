import SchoolYearForm from "@/views/school/schoolYears/SchoolYearForm";
import AddItem from "@/utils/forms/create";
import { SchoolYearSaveDocument } from "@/gql/graphql";

const SchoolYearAdd = (props: any) => (
    <AddItem
        mutation={SchoolYearSaveDocument}
        form={<SchoolYearForm {...props} />}
    />
)

export default SchoolYearAdd;

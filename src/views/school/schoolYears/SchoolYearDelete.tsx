import { SchoolYearDeleteDocument, SchoolYearsDocument } from "@/gql/graphql";
import DeleteItem from "@/utils/forms/delete";

const SchoolYearDelete = (props: any) => (
    <DeleteItem
        mutation={SchoolYearDeleteDocument}
        query={SchoolYearsDocument}
        listVar="schoolYears"
        singleVar="schoolYear"
        {...props}
    />
)

export default SchoolYearDelete;

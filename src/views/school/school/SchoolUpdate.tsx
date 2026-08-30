import SchoolForm from "@/views/school/school/SchoolForm";
import UpdateItem from "@/utils/forms/edit";
import { SchoolByIdDocument, SchoolSaveDocument } from "@/gql/graphql";

const SchoolUpdate = (props: any) => (
    <UpdateItem
        mutation={SchoolSaveDocument}
        query={SchoolByIdDocument}
        form={<SchoolForm {...props} />}
        listVar="schools"
        singleVar="school"
    />
)

export default SchoolUpdate;

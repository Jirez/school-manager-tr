import {cloneElement} from 'react';

import SchoolYearForm from './SchoolYearForm';
import { useApolloClient} from "@apollo/client";
import {useAuthentication} from "@/hooks/useAuthentication";
import { SchoolYearsDocument, useSchoolYearSaveMutation } from '@/gql/graphql';

const UpdateSchoolYear = (props: any) => {
    const client = useApolloClient();
    const {enterpriseId} = useAuthentication();
    const [updateItem] = useSchoolYearSaveMutation({
        client: props.client,
        update(cache, {data}){
            const list : {[key: string]: []} | null = cache.readQuery({
                query: SchoolYearsDocument,
                variables: {"id": enterpriseId}
            });
            const listVar = "schoolYears";
            cache.writeQuery({
                query: SchoolYearsDocument,
                variables: {"id": enterpriseId},
                data: {[listVar]: list![listVar]}
            });
            client.resetStore();
        }
    });

    return <>
        {
            cloneElement(<SchoolYearForm {...props} />, {action: updateItem, ...props})
        }
    </>
}

export default UpdateSchoolYear;

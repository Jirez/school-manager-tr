/* import { Form as BaseForm } from "reactstrap"
import {
    useForm,
    UseFormReturn,
    SubmitHandler,
    UseFormProps,
} from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';

type FormProps<TFormValues> = {
    onSubmit: SubmitHandler<TFormValues>;
    //children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
    children: (methods: any) => React.ReactNode;
    options?: any; //UseFormProps<TFormValues>;
    validationSchema?: any; // don't worry it's not important for this case
    className?: string;
    [key: string]: unknown;
};


export const Form = <
    TFormValues extends Record<string, any> = Record<string, any>
>({
    onSubmit,
    children,
    options,
    className,
    validationSchema,
    ...props
}: FormProps<TFormValues>) => {
    const methods = useForm<TFormValues>({
        //...(!!validationSchema && { resolver: yupResolver(validationSchema) }),
        ...(!!options && options),
    });
    return (
        <BaseForm
            onSubmit={methods.handleSubmit(onSubmit)}
            className={className} //grid gap-3, flex flex-col space-y-3
            noValidate
            {...props}
        >
            {children(methods)}
        </BaseForm>
    );
};
 */

export const Form = () => <span />;

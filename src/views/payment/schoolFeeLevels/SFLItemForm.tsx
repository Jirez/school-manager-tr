import { useFieldArray } from "react-hook-form";
import SFLItemItemForm from "./SFLItemItemForm";
import { useEffect, useState } from "react";

interface Props {
  nestIndex: number;
  control: any;
  register: any;
  getValues: any;
  watch: any;
}

const SFLItemForm = ({
  nestIndex,
  control,
  register,
  getValues,
  watch,
}: Props) => {
  const [total, setTotal] = useState<Map<number, number>>();

  const { fields } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  });

  useEffect(() => {
    const totalBySlice = new Map<number, number>();
    watch(`items.${nestIndex}.items`).forEach((item: any) => {
      const total = item.items.reduce(
        (acc: number, cur: any) => acc + parseFloat(cur.requiredAmount),
        0
      );
      totalBySlice.set(item.paymentSliceId, total);
    });
    console.log(totalBySlice);
    setTotal(totalBySlice);
  }, [watch(`items.${nestIndex}.items`)]);

  return (
    <div>
      {fields.map((field, index) => (
        <div
          className="flex flex-row items-center w-full border p-1 mb-1"
          key={`${field.id}`}
        >
          <div className="pr-1 flex flex-row items-center justify-center w-1/4">
            {/* @ts-expect-error */}
            Tranche : {field.paymentSliceName} - {/* @ts-expect-error */}
            {total && total.get(field.paymentSliceId)}
          </div>
          <SFLItemItemForm
            nestIndex={nestIndex}
            subIndex={index}
            control={control}
            register={register}
            getValues={getValues}
            watch={watch}
          />
        </div>
      ))}
    </div>
  );
};

export default SFLItemForm;

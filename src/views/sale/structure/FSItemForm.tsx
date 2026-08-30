import { useFieldArray, useWatch } from "react-hook-form";
import FSItemItemForm from "./FSItemItemForm";
import { useMemo } from "react";
import { Calendar } from "lucide-react";

interface Props {
  nestIndex: number;
  control: any;
  register: any;
  getValues: any;
  watch: any;
  setValue: any;
}

const FSItemForm = ({
  nestIndex,
  control,
  register,
  getValues,
  watch,
  setValue,
}: Props) => {
  const { fields } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  });

  // Watch the entire nested structure for changes
  const watchedItems = useWatch({
    control,
    name: `items.${nestIndex}.items`,
    defaultValue: [],
  });

  // Calculate totals whenever watchedItems changes
  const total = useMemo(() => {
    const totalBySlice = new Map<number, number>();

    if (!watchedItems || !Array.isArray(watchedItems)) {
      return totalBySlice;
    }

    watchedItems.forEach((item: any) => {
      if (!item || !item.items || !Array.isArray(item.items)) {
        return;
      }

      const installmentTotal = item.items.reduce((acc: number, cur: any) => {
        if (!cur || !cur.requiredAmount) {
          return acc;
        }
        const amount = parseFloat(cur.requiredAmount);
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0);

      if (item.installmentId) {
        totalBySlice.set(item.installmentId, installmentTotal);
      }
    });

    return totalBySlice;
  }, [watchedItems]);

  return (
    <div className="space-y-2">
      {fields.map((field, index) => {
        const installmentTotal = total?.get(field.installmentId) || 0;

        return (
          <div
            key={`${field.id}`}
            className="
              group
              bg-gray-50/80 dark:!bg-gray-700/30
              border border-gray-200 dark:!border-gray-600
              rounded-lg
              transition-all duration-200
              hover:!border-purple-500 dark:hover:!border-purple-600
              overflow-hidden
            "
          >
            {/* Installment Header */}
            <div
              className="
                flex items-center gap-2
                px-2.5 py-1.5
                bg-white/50 dark:!bg-gray-800/50
                border-b border-gray-200 dark:!border-gray-600
              "
            >
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 bg-purple-100 dark:!bg-purple-900/40">
                <Calendar
                  size={12}
                  className="text-purple-600 dark:!text-purple-400"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:!text-gray-300">
                {field.installmentName}
              </span>
              <span className="text-xs font-semibold text-purple-600 dark:!text-purple-400 ml-auto">
                {installmentTotal.toLocaleString()} FCFA
              </span>
            </div>

            {/* Tuition Items */}
            <div className="p-1.5">
              <FSItemItemForm
                nestIndex={nestIndex}
                subIndex={index}
                control={control}
                register={register}
                getValues={getValues}
                watch={watch}
                setValue={setValue}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FSItemForm;

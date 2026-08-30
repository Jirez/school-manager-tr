import type { SchoolYearType } from "@/views/school/schoolYears/SchoolYear.type";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useForm, useFormState } from "react-hook-form";
import { default as FormItem } from "@/@core/components/ui/forms/input";
import { useAuthentication } from "@/hooks/useAuthentication";
import dayjs from "dayjs";
import { Form } from "reactstrap";
import { formatError } from "@/utils/ErrorHelper";
import ActionButtons from "@/@core/components/ui/forms/action-buttons";
import DatePicker from "@/@core/components/ui/forms/date-picker";
import Switch from "@/@core/components/ui/forms/swith";
import { validationSchema } from "@/views/school/schoolYears/SchoolYear.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { messageService } from "@/utils/message.service";
import { TOAST_OPTIONS } from "@/utils/constants";
import {
  Settings,
  Users,
  Layout,
  Type,
  Hash,
  Activity,
  CalendarRange,
  Edit3,
} from "lucide-react";
import StickyActions from "@/@core/components/ui/forms/sticky-actions";
import FormSection from "@/@core/components/ui/forms/form-section";
import ControlledSelect from "@/@core/components/ui/forms/controlled-select";
import ToggleOption from "@/@core/components/ui/forms/toggle-option";

interface SchoolYearFormProps extends BaseFormProps {
  schoolYear?: SchoolYearType;
  loading: boolean;
}

const initialValues: Partial<SchoolYearType> = {
  label: "",
  label2: "",
  ageMin: undefined,
  ageMax: undefined,
  current: true,
  startDate: new Date(),
  endDate: new Date(),
  cycleCount: undefined,
  periodType: undefined,
};

const SchoolYearForm: FC<SchoolYearFormProps> = ({
  schoolYear,
  modal,
  action,
  loading,
  ...props
}) => {
  // ** Hooks
  const { t } = useTranslation();
  const { enterpriseId } = useAuthentication();

  const perioTypeOptions = [
    { value: "TRIMESTER", label: t("label-trimester") },
    { value: "SEMESTER", label: t("label-semester") },
  ];

  const { control, getValues, handleSubmit, reset, watch, setValue } =
    useForm<SchoolYearType>({
      defaultValues: {
        label: schoolYear?.label || "",
        label2: schoolYear?.label2 || "",
        current: schoolYear ? schoolYear.current : true,
        startDate: schoolYear
          ? dayjs(schoolYear.startDate).toDate()
          : new Date(),
        endDate: schoolYear ? dayjs(schoolYear.endDate).toDate() : new Date(),
        ageMax: schoolYear?.ageMax || "",
        ageMin: schoolYear?.ageMin || "",
        cycleCount: schoolYear?.cycleCount || undefined,
        periodType: schoolYear
          ? {
              value: schoolYear.periodType,
              label: perioTypeOptions.find(
                (option) => option.value === schoolYear.periodType,
              )?.label,
            }
          : undefined,
      },
      resolver: yupResolver(validationSchema),
    });

  const { isDirty } = useFormState({ control });

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    return handleSubmit(async (values) => {
      const id = schoolYear ? Number(schoolYear.id) : undefined;

      action({
        variables: {
          schoolYear: {
            ...values,
            id,
            startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
            ageMin: values.ageMin ? Number(values.ageMin) : null,
            ageMax: values.ageMax ? Number(values.ageMax) : null,
            schoolId: enterpriseId,
            periodType: values.periodType.value,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues);
          toast.success(`Année scolaire enregistrée`, { ...TOAST_OPTIONS });

          if (props.popover) {
            messageService.sendMessage("schoolYear", data.schoolYear);
            props.onModalClose?.();
          }

          if (close) {
            modal?.hide();
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter l'année scolaire: ${formatError(error)}`,
          );
        });
    })(event);
  };

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Configuration Section */}
        <FormSection
          title={t("label-configuration") || "Configuration"}
          description={
            t("label-schoolYearSettingsDesc") ||
            "Configure cycle and period types"
          }
          icon={<Settings size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <ControlledSelect
              name="periodType"
              label={t("label-periodType")}
              control={control}
              required
              prepend={<Layout size={16} />}
              options={perioTypeOptions}
              placeholder={t("label-select")}
              onChange={(value) => {
                setValue("periodType", value);
              }}
            />

            <FormItem
              name="cycleCount"
              label={t("label-cycleCount")}
              control={control}
              type="number"
              required
              prepend={<Hash size={16} />}
            />

            <div className="flex flex-col gap-1">
              <ToggleOption
                icon={<Activity size={16} />}
                title={t("label-default")}
                description={
                  t("label-defaultSchoolYearDesc") ||
                  "Make this the active year"
                }
                isActive={watch("current")}
              >
                <Switch
                  name="current"
                  control={control}
                  defaultChecked={getValues("current")}
                  label=""
                />
              </ToggleOption>
            </div>
          </div>
        </FormSection>

        {/* Labels Section */}
        <FormSection
          title={t("label-designations") || "Designations"}
          description={
            t("label-schoolYearLabelsDesc") || "Naming for this academic year"
          }
          icon={<Type size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-1">
            <FormItem
              name="label"
              label={t("label-designation")}
              control={control}
              required
              prepend={<Edit3 size={16} />}
              placeholder="e.g. Année scolaire 2025-2026"
            />

            <FormItem
              name="label2"
              label={t("label-designation2")}
              control={control}
              required
              prepend={<Type size={16} />}
              placeholder="Alternative name"
            />
          </div>
        </FormSection>

        {/* Dates Section */}
        <FormSection
          title={t("label-dates") || "Dates"}
          description={
            t("label-schoolYearDatesDesc") || "Academic calendar range"
          }
          icon={<CalendarRange size={18} />}
          color="#00cfe8"
        >
          <div className="space-y-1">
            <DatePicker
              name="startDate"
              label={t("label-startDate")}
              control={control}
              required
            />

            <DatePicker
              name="endDate"
              label={t("label-endDate")}
              control={control}
              required
            />
          </div>
        </FormSection>

        {/* Age Limits Section */}
        <FormSection
          title={t("label-ageLimits") || "Age Limits"}
          description={t("label-ageLimitsDesc") || "Age range for enrollment"}
          icon={<Users size={18} />}
          color="#ea5455"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="ageMin"
              label={t("label-ageMin")}
              control={control}
              type="number"
              prepend={<Users size={16} className="text-success" />}
              placeholder="Minimum age"
            />

            <FormItem
              name="ageMax"
              label={t("label-ageMax")}
              control={control}
              type="number"
              prepend={<Users size={16} className="text-danger" />}
              placeholder="Maximum age"
            />
          </div>
        </FormSection>
      </div>

      {/* Action Buttons */}
      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          popover={props.popover}
          isSubmitting={loading}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  );
};

export default SchoolYearForm;

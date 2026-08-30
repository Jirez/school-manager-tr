import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalForm from "@/@core/components/ui/modal-form";
import SchoolYearAdd from "@/views/school/schoolYears/SchoolYearAdd";
import SchoolYearUpdate from "@/views/school/schoolYears/SchoolYearUpdate";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";

export default NiceModal.create(({ schoolYear, update }: any) => {
	const modal = useModal();
	const { t } = useTranslation();

	return (
		<ModalForm
			modal={modal}
			className="modal-lg"
			// fullscreen={"md"}
			title={
				update ? t("action.update_schoolYear") : t("action.add_schoolYear")
			}
		>
			<Suspense>
				{update ? (
					<SchoolYearUpdate
						schoolYear={schoolYear}
						modal={modal}
					/>
				) : (
					<SchoolYearAdd modal={modal} />
				)}
			</Suspense>
		</ModalForm>
	);
});

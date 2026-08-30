// ** Icons Import
import { Circle } from "react-feather";
import { MdPayments } from "react-icons/md";
import {
  PAYMENT_MODE,
  SCHOOL_FEE_LEVELS,
  SCHOOL_FEE_LEVELS_2,
  SCHOOL_FEES,
} from "@utils/constants";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN, ROLE_PAIEMENT
export default [
  {
    id: "payment",
    title: "sidebar.payments",
    icon: <MdPayments size={56} width="56px" height="56px" />,
    //badge: 'light-warning',
    //badgeText: '2',
    meta: {
      resource: "payment",
    },
    children: [
      {
        id: "payment-modes",
        title: "sidebar.payments.modes",
        icon: <Circle size={12} />,
        navLink: PAYMENT_MODE,
      },
      {
        id: "payment-groups",
        title: "sidebar.payments.groups",
        icon: <Circle size={12} />,
        navLink: "/payment-groups",
      },
      {
        id: "payment-slices",
        title: "sidebar.payments.slices",
        icon: <Circle size={12} />,
        navLink: "/payment-slices",
      },
      {
        id: "paymentSchoolFees",
        title: "sidebar.payments.schoolFees",
        icon: <Circle size={12} />,
        navLink: SCHOOL_FEES,
      },
      {
        id: "paymentSchool-fee-levels",
        title: "sidebar.payments.schoolFeeLevels",
        icon: <Circle size={12} />,
        navLink: SCHOOL_FEE_LEVELS,
      },
      {
        id: "paymentSchool-fee-levels-2",
        title: "sidebar.payments.schoolFeeLevels2",
        icon: <Circle size={12} />,
        navLink: SCHOOL_FEE_LEVELS_2,
      },
      {
        id: "student-invoices",
        title: "sidebar.payments.invoices",
        icon: <Circle size={12} />,
        navLink: "/student-invoices",
        meta: {
          resource: "invoice",
        },
      },
      {
        id: "student-payments",
        title: "sidebar.payments.students",
        icon: <Circle size={12} />,
        navLink: "/student-payments",
      },
    ],
  },
];

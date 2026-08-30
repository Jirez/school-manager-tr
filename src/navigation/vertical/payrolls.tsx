// ** Icons Import
import { Circle } from "react-feather";
import { Banknote } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_AMIN
export default [
  {
    id: "payrolls",
    title: "sidebar.payrolls",
    icon: <NavIcon icon={<Banknote size={14} />} color="#ff9f43" />,
    meta: {
      resource: "payroll",
    },
    children: [
      {
        id: "payrolls",
        title: "sidebar.payroll.list",
        icon: <Circle size={12} />,
        navLink: "/payrolls",
      },
      {
        id: "employees",
        title: "sidebar.payroll.employees",
        icon: <Circle size={12} />,
        navLink: "/employees",
      },
      {
        id: "payroll-periods",
        title: "sidebar.payroll.periods",
        icon: <Circle size={12} />,
        navLink: "/payroll-periods",
      },
      {
        id: "payroll-positions",
        title: "sidebar.payroll.positions",
        icon: <Circle size={12} />,
        navLink: "/payroll-positions",
      },
      {
        id: "earning-categories",
        title: "sidebar.payroll.earningCategories",
        icon: <Circle size={12} />,
        navLink: "/earning-categories",
      },
      {
        id: "earnings",
        title: "sidebar.payroll.earnings",
        icon: <Circle size={12} />,
        navLink: "/earnings",
      },
      {
        id: "deduction-categories",
        title: "sidebar.payroll.deductionCategories",
        icon: <Circle size={12} />,
        navLink: "/deduction-categories",
      },
      {
        id: "deductions",
        title: "sidebar.payroll.deductions",
        icon: <Circle size={12} />,
        navLink: "/deductions",
      },
      {
        id: "departments",
        title: "sidebar.payroll.departments",
        icon: <Circle size={12} />,
        navLink: "/payroll-departments",
      },
    ],
  },
];

// ** Icons Import
import { Circle } from "react-feather";
import { Receipt } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "expense",
    title: "sidebar.expenses",
    icon: <NavIcon icon={<Receipt size={14} />} color="#ea5455" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "expenses",
        title: "sidebar.expenses.list",
        icon: <Circle size={12} />,
        navLink: "/expenses",
      },
      {
        id: "purchases",
        title: "sidebar.expenses.purchases",
        icon: <Circle size={12} />,
        navLink: "/purchases",
      },
      {
        id: "suppliers",
        title: "sidebar.sales.suppliers",
        icon: <Circle size={12} />,
        navLink: "/suppliers",
      },
      {
        id: "vouchers",
        title: "sidebar.expenses.vouchers",
        icon: <Circle size={12} />,
        navLink: "/vouchers",
      },
      {
        id: "expenseCategories",
        title: "sidebar.expenses.categories",
        icon: <Circle size={12} />,
        navLink: "/expense-categories",
      },
      {
        id: "operationClasses",
        title: "sidebar.core.operationClasses",
        icon: <Circle size={12} />,
        navLink: "/operation-classes",
      },
    ],
  },
];

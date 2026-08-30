// ** Icons Import
import { Circle } from "react-feather";
import { ShoppingBag } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "sale",
    title: "sidebar.sales",
    icon: <NavIcon icon={<ShoppingBag size={14} />} color="#28c76f" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "operations",
        title: "sidebar.sales.operations",
        icon: <Circle size={12} />,
        navLink: "/operations",
      },
      {
        id: "mobileOperations",
        title: "sidebar.sales.mobileOperations",
        icon: <Circle size={12} />,
        navLink: "/mobile-operations",
      },
      {
        id: "products",
        title: "sidebar.sales.products",
        icon: <Circle size={12} />,
        navLink: "/products",
        meta: {
          resource: "product",
        },
      },
      {
        id: "customers",
        title: "sidebar.sales.customers",
        icon: <Circle size={12} />,
        navLink: "/customers",
        meta: {
          resource: "customer",
        },
      },
      {
        id: "schoolFees",
        title: "sidebar.sales.tuitions",
        icon: <Circle size={12} />,
        navLink: "/fee-groups",
      },
    ],
  },
];

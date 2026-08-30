// ** Icons Import
import { Circle } from "react-feather";
import { BookOpen } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "subjects",
    title: "sidebar.subjects",
    icon: <NavIcon icon={<BookOpen size={14} />} color="#ff9f43" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "departments",
        title: "sidebar.subjects.departments",
        icon: <Circle size={12} />,
        navLink: "/departments",
      },
      {
        id: "headDepartments",
        title: "sidebar.subjects.headDepartments",
        icon: <Circle size={12} />,
        navLink: "/head-departments",
      },
      {
        id: "subjects",
        title: "sidebar.subjects.list",
        icon: <Circle size={12} />,
        navLink: "/subjects",
      },
      {
        id: "subjectGroup",
        title: "sidebar.subjects.subjectGroups",
        icon: <Circle size={12} />,
        navLink: "/subject-groups",
      },
    ],
  },
];

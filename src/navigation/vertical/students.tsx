// ** Icons Import
import { Circle } from "react-feather";
import { GraduationCap } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "students",
    title: "sidebar.students",
    icon: <NavIcon icon={<GraduationCap size={14} />} color="#28c76f" />,
    meta: {
      resource: "student",
    },
    children: [
      {
        id: "frequents",
        title: "sidebar.students.list",
        icon: <Circle size={12} />,
        navLink: "/frequents",
      },
      {
        id: "updateStudentByClass",
        title: "sidebar.students.updateByClass",
        icon: <Circle size={12} />,
        navLink: "/student-update-by-class",
      },
      {
        id: "duplicated",
        title: "sidebar.students.duplicated",
        icon: <Circle size={12} />,
        navLink: "/duplicated-students",
      },
      {
        id: "batch-pictures",
        title: "sidebar.students.batchPicture",
        icon: <Circle size={12} />,
        navLink: "/batch-pictures",
      },
      {
        id: "student-progression",
        title: "sidebar.students.studentProgression",
        icon: <Circle size={12} />,
        navLink: "/student-progression",
      },
      {
        id: "guardians",
        title: "sidebar.students.guardian",
        icon: <Circle size={12} />,
        navLink: "/guardians",
      },
    ],
  },
];

// ** Icons Import
import { Circle } from "react-feather";
import { BookOpen } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN, ROLE_ENSEIGNANT, ROLE_AJOUT_NOTE
export default [
  {
    id: "primaryNotes",
    title: "sidebar.primary.notes",
    icon: <NavIcon icon={<BookOpen size={14} />} color="#ff9f43" />,
    meta: {
      resource: "note",
      isPrimary: true,
    },
    children: [
      {
        id: "evalType",
        title: "sidebar.primary.evalTypes",
        icon: <Circle size={12} />,
        navLink: "/eval-types",
      },
      {
        id: "primaryCompetences",
        title: "sidebar.primary.competences",
        icon: <Circle size={12} />,
        navLink: "/primary-competences",
      },
      {
        id: "competencesByLevel",
        title: "sidebar.primary.competencesByLevel",
        icon: <Circle size={12} />,
        navLink: "/primary-competences-level",
      },
      {
        id: "subCompetences",
        title: "sidebar.primary.subCompetences",
        icon: <Circle size={12} />,
        navLink: "/sub-competences",
      },
      {
        id: "pSequentialNotes",
        title: "sidebar.primary.sequentialNotes",
        icon: <Circle size={12} />,
        navLink: "/primary-sequential-notes",
      },
      {
        id: "pFreeSequentialNotes",
        title: "sidebar.primary.freeSequentialNotes",
        icon: <Circle size={12} />,
        navLink: "/free-primary-sequential-notes",
      },
    ],
  },
];

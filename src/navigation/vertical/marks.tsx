// ** Icons Import
import { ANNUAL_NOTES } from '@/utils/constants'
import { Circle } from 'react-feather'
import { ClipboardCheck } from 'lucide-react'
import NavIcon from './NavIcon'

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN, ROLE_ENSEIGNANT, ROLE_AJOUT_NOTE
export default [
  {
    id: 'marks',
    title: 'sidebar.marks',
    icon: <NavIcon icon={<ClipboardCheck size={14} />} color="#7367f0" />,
    meta: {
      resource: 'note',
      isPrimary: false,
    },
    children: [
      {
        id: 'evalCompBySubject',
        title: 'sidebar.marks.evaluatedCompetencesBySubject',
        icon: <Circle size={12} />,
        navLink: '/eval-competences-subject',
      },
      {
        id: 'evalComp',
        title: 'sidebar.marks.evaluatedCompetences',
        icon: <Circle size={12} />,
        navLink: '/eval-competences',
        resource: 'config',
      },
      {
        id: 'competences',
        title: 'sidebar.marks.expectedCompetences',
        icon: <Circle size={12} />,
        navLink: '/competences',
      },
      {
        id: 'quarterly-comp-notes',
        title: 'sidebar.marks.quarterlyCompNotes',
        icon: <Circle size={12} />,
        navLink: '/quarterly-comp-note',
      },
      {
        id: 'quarterly-comp-notes-eval',
        title: 'sidebar.marks.quarterlyCompNoteFromEval',
        icon: <Circle size={12} />,
        navLink: '/quarterly-comp-note-eval',
      },
      {
        id: 'sequential-notes',
        title: 'sidebar.marks.sequentialNotes',
        icon: <Circle size={12} />,
        navLink: '/sequential-notes',
      },
      {
        id: 'quarterly-notes',
        title: 'sidebar.marks.quarterlyNotes',
        icon: <Circle size={12} />,
        navLink: '/quarterly-notes',
      },
      {
        id: 'annual-notes',
        title: 'sidebar.marks.annualNotes',
        icon: <Circle size={12} />,
        navLink: ANNUAL_NOTES,
      },
      {
        id: 'markCopy',
        title: 'sidebar.marks.copy',
        icon: <Circle size={12} />,
        navLink: '/sequential-note-copy',
      },
      {
        id: 'markDowngrade',
        title: 'sidebar.marks.exclude',
        icon: <Circle size={12} />,
        navLink: '/sequential-note-downgrade',
      },
      {
        id: 'deleteNote',
        title: 'sidebar.marks.delete',
        icon: <Circle size={12} />,
        navLink: '/sequential-note-delete',
      },
      {
        id: 'sequentialNoteTemplate',
        title: 'sidebar.marks.template',
        icon: <Circle size={12} />,
        navLink: '/sequential-note-template',
      },
      {
        id: 'sequentialNoteImport',
        title: 'sidebar.marks.import',
        icon: <Circle size={12} />,
        navLink: '/sequential-note-import',
      },
      {
        id: 'quarterlyReportObservation',
        title: 'sidebar.marks.quarterlyReportObservation',
        icon: <Circle size={12} />,
        navLink: '/quarterly-report-observation',
      },
      {
        id: 'noteCalculation',
        title: 'sidebar.marks.noteCalculation',
        icon: <Circle size={12} />,
        navLink: '/note-calculation',
      },
      {
        id: 'averageCalculation',
        title: 'sidebar.marks.averageCalculation',
        icon: <Circle size={12} />,
        navLink: '/average-calculation',
      },
      {
        id: 'council-decision',
        title: 'sidebar.school.councilDecisions',
        icon: <Circle size={12} />,
        navLink: '/council-decision',
      },
      {
        id: 'annual-result',
        title: 'sidebar.marks.annualResult',
        icon: <Circle size={12} />,
        navLink: '/annual-result',
      },
      {
        id: 'bulk-annual-result',
        title: 'sidebar.marks.bulkAnnualResult',
        icon: <Circle size={12} />,
        navLink: '/bulk-annual-result',
      },
    ],
  },
]

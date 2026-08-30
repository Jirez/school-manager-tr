import type { LinkProps } from '@/@core/components/navs/navs'
import {
  BookOpen,
  Layers,
  Package,
  UserCheck,
  Users,
  Heart,
  Archive,
  ShoppingCart,
  Calendar,
  Briefcase,
  Grid,
  Layout,
  GitBranch,
  BarChart2,
  RefreshCw,
  Clock,
  Shield,
  Key,
  Folder,
  Sliders,
  CreditCard,
  DollarSign,
  FileText,
  Tag,
  Hash,
  PieChart,
  Book,
  Edit3,
  Award,
  Target,
  CheckSquare,
  // ArrowLeftRight,
  Truck,
  Share2,
  TrendingDown,
} from 'react-feather'
import {
  ACCOUNT_CATEGORIES,
  ACCOUNT_GROUPS,
  ACCOUNT_MODELS,
  BRANCHES,
  CHART_OF_ACCOUNTS,
  CLASSES,
  CYCLES,
  LEVELS,
  LOG_CODES,
  LOGIN_HISTORIES,
  OFFICIAL_FUNCTIONS,
  PAYMENT_GROUPS,
  PAYMENT_MODE,
  PAYMENT_SLICES,
  PERIODS,
  ROLES,
  SCHOOL_LIABLE,
  SCHOOL_OFFICIALS,
  SCHOOL_SECTIONS,
  SCHOOL_YEARS,
  SUB_PERIODS,
  USERS,
  PAYROLL_PERIODS,
  ACCOUNTS,
  JOURNAL,
  STUDENT_PAYMENTS,
  STUDENT_INVOICES,
  COMPETENCES,
  SUB_COMPETENCES,
  EVAL_TYPES,
  BANK_ACCOUNTS,
  BANK_TRANSACTIONS,
  SUPPLIER_CATEGORIES,
  SUPPLIERS,
  CUSTOMERS,
  CUSTOMER_CATEGORIES,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  DAY_OF_CLASSES,
  TIME_SLOTS,
  CLASS_DISTRIBUTION,
  FEE_GROUPS,
  INSTALLMENTS,
  FEE_STRUCTURES,
  OPERATIONS,
  PERMISSIONS,
  PAYROLLS,
  PAYROLL_EMPLOYEES,
  EXPENSES,
  EXPENSE_CATEGORIES,
} from '@/utils/constants'
import { AiFillMoneyCollect } from 'react-icons/ai'

export const SubjectLinks: LinkProps[] = [
  {
    id: 'subjects',
    navLink: '/subjects',
    title: 'sidebar.subjects',
    icon: <BookOpen size={12} />,
  },
  {
    id: 'departments',
    navLink: '/departments',
    title: 'sidebar.subjects.departments',
    icon: <Layers size={12} />,
  },
  {
    id: 'subjectGroups',
    navLink: '/subject-groups',
    title: 'sidebar.subjects.subjectGroups',
    icon: <Package size={12} />,
  },
]

export const StudentsLinks: LinkProps[] = [
  {
    id: 'frequents',
    navLink: '/frequents',
    title: 'sidebar.students.frequents',
    icon: <UserCheck size={12} />,
  },
  {
    id: 'students',
    navLink: '/students',
    title: 'sidebar.students',
    icon: <Users size={12} />,
  },
  {
    id: 'guardians',
    navLink: '/guardians',
    title: 'sidebar.students.guardian',
    icon: <Heart size={12} />,
  },
  {
    id: 'oldSchools',
    navLink: '/old-schools',
    title: 'sidebar.students.oldSchools',
    icon: <Archive size={12} />,
  },
  {
    id: 'operations',
    navLink: OPERATIONS,
    title: 'sidebar.sales.operations',
    icon: <ShoppingCart size={12} />,
  },
]

export const SchoolYearLinks: LinkProps[] = [
  {
    id: 'schoolYears',
    navLink: SCHOOL_YEARS,
    title: 'sidebar.school.schoolYears',
    icon: <Calendar size={12} />,
  },
  {
    id: 'schoolLiable',
    navLink: SCHOOL_LIABLE,
    title: 'sidebar.school.liable',
    icon: <Briefcase size={12} />,
  },
  {
    id: 'schoolSections',
    navLink: SCHOOL_SECTIONS,
    title: 'sidebar.school.schoolSections',
    icon: <Grid size={12} />,
  },
]

export const ClassLinks: LinkProps[] = [
  {
    id: 'classes',
    navLink: CLASSES,
    title: 'sidebar.school.classes',
    icon: <Layout size={12} />,
  },
  {
    id: 'branches',
    navLink: BRANCHES,
    title: 'sidebar.school.branches',
    icon: <GitBranch size={12} />,
  },
  {
    id: 'levels',
    navLink: LEVELS,
    title: 'sidebar.school.levels',
    icon: <BarChart2 size={12} />,
  },
  {
    id: 'cycles',
    navLink: CYCLES,
    title: 'sidebar.school.cycles',
    icon: <RefreshCw size={12} />,
  },
]

export const UserLinks: LinkProps[] = [
  {
    id: 'users',
    navLink: USERS,
    title: 'sidebar.users',
    icon: <Users size={12} />,
  },
  {
    id: 'loginHistory',
    navLink: LOGIN_HISTORIES,
    title: 'sidebar.users.history',
    icon: <Clock size={12} />,
  },
  {
    id: 'roles',
    navLink: ROLES,
    title: 'sidebar.users.roles',
    icon: <Shield size={12} />,
  },
  {
    id: 'permissions',
    navLink: PERMISSIONS,
    title: 'sidebar.users.permissions',
    icon: <Key size={12} />,
  },
]

export const PeriodLinks: LinkProps[] = [
  {
    id: 'periods',
    navLink: PERIODS,
    title: 'sidebar.school.periods',
    icon: <Calendar size={12} />,
  },
  {
    id: 'subPeriods',
    navLink: SUB_PERIODS,
    title: 'sidebar.school.subPeriods',
    icon: <Layers size={12} />,
  },
]

export const PaymentLinks: LinkProps[] = [
  {
    id: 'paymentGroups',
    navLink: PAYMENT_GROUPS,
    title: 'sidebar.payments.groups',
    icon: <Folder size={12} />,
  },
  {
    id: 'paymentSlices',
    navLink: PAYMENT_SLICES,
    title: 'sidebar.payments.slices',
    icon: <Sliders size={12} />,
  },
  {
    id: 'paymentModes',
    navLink: PAYMENT_MODE,
    title: 'sidebar.payments.modes',
    icon: <CreditCard size={12} />,
  },
]

export const InvoiceLinks: LinkProps[] = [
  {
    id: 'studentPayments',
    navLink: STUDENT_PAYMENTS,
    title: 'sidebar.payments.students',
    icon: <DollarSign size={12} />,
  },
  {
    id: 'studentInvoices',
    navLink: STUDENT_INVOICES,
    title: 'sidebar.payments.invoices',
    icon: <FileText size={12} />,
  },
  {
    id: 'frequents',
    navLink: '/frequents',
    title: 'sidebar.students.frequents',
    icon: <UserCheck size={12} />,
  },
]

export const OfficialLinks: LinkProps[] = [
  {
    id: 'schoolOfficials',
    navLink: SCHOOL_OFFICIALS,
    title: 'sidebar.school.liable',
    icon: <Briefcase size={12} />,
  },
  {
    id: 'officialTypes',
    navLink: OFFICIAL_FUNCTIONS,
    title: 'sidebar.school.liableTypes',
    icon: <Tag size={12} />,
  },
]

export const AccountLinks: LinkProps[] = [
  {
    id: 'accountModels',
    navLink: ACCOUNT_MODELS,
    title: 'sidebar.accounting.models',
    icon: <FileText size={12} />,
  },
  {
    id: 'accountGroups',
    navLink: ACCOUNT_GROUPS,
    title: 'sidebar.accounting.groups',
    icon: <Folder size={12} />,
  },
  {
    id: 'logCodes',
    navLink: LOG_CODES,
    title: 'sidebar.accounting.codes',
    icon: <Hash size={12} />,
  },
  {
    id: 'accountCategories',
    navLink: ACCOUNT_CATEGORIES,
    title: 'sidebar.accounting.categories',
    icon: <Tag size={12} />,
  },
  {
    id: 'chartOfAccounts',
    navLink: CHART_OF_ACCOUNTS,
    title: 'sidebar.accounting.chart',
    icon: <PieChart size={12} />,
  },
]

export const PayrollLinks: LinkProps[] = [
  {
    id: 'payrolls',
    navLink: PAYROLLS,
    title: 'sidebar.payroll.list',
    icon: <DollarSign size={12} />,
  },
  {
    id: 'payrollPeriods',
    navLink: PAYROLL_PERIODS,
    title: 'sidebar.payrolls.periods',
    icon: <Calendar size={12} />,
  },
  {
    id: 'employees',
    navLink: PAYROLL_EMPLOYEES,
    title: 'sidebar.payroll.employees',
    icon: <Users size={12} />,
  },
]

export const AccountEntriesLinks: LinkProps[] = [
  {
    id: 'accounts',
    navLink: ACCOUNTS,
    title: 'sidebar.accounting.chartOfAccount',
    icon: <Book size={12} />,
  },
  {
    id: 'journal',
    navLink: JOURNAL,
    title: 'sidebar.accounting.journal',
    icon: <Edit3 size={12} />,
  },
]

export const CompetenceLinks: LinkProps[] = [
  {
    id: 'competences',
    navLink: COMPETENCES,
    title: 'sidebar.primary.competences',
    icon: <Award size={12} />,
  },
  {
    id: 'subCompetences',
    navLink: SUB_COMPETENCES,
    title: 'sidebar.primary.subCompetences',
    icon: <Target size={12} />,
  },
  {
    id: 'evalTypes',
    navLink: EVAL_TYPES,
    title: 'sidebar.primary.evalTypes',
    icon: <CheckSquare size={12} />,
  },
]

export const BankLinks: LinkProps[] = [
  {
    id: 'bankAccounts',
    navLink: BANK_ACCOUNTS,
    title: 'sidebar.bank.accounts',
    icon: <CreditCard size={12} />,
  },
  {
    id: 'bankTransactions',
    navLink: BANK_TRANSACTIONS,
    title: 'sidebar.bank.transactions',
    icon: <AiFillMoneyCollect size={12} />,
  },
]

export const SupplierLinks: LinkProps[] = [
  {
    id: 'supplierCategories',
    navLink: SUPPLIER_CATEGORIES,
    title: 'sidebar.sales.supplierCategories',
    icon: <Tag size={12} />,
  },
  {
    id: 'suppliers',
    navLink: SUPPLIERS,
    title: 'sidebar.sales.suppliers',
    icon: <Truck size={12} />,
  },
]

export const CustomerLinks: LinkProps[] = [
  {
    id: 'customerCategories',
    navLink: CUSTOMER_CATEGORIES,
    title: 'sidebar.sales.customerCategories',
    icon: <Tag size={12} />,
  },
  {
    id: 'customers',
    navLink: CUSTOMERS,
    title: 'sidebar.sales.customers',
    icon: <Users size={12} />,
  },
]

export const ProductLinks: LinkProps[] = [
  {
    id: 'productCategories',
    navLink: PRODUCT_CATEGORIES,
    title: 'sidebar.sales.productCategories',
    icon: <Tag size={12} />,
  },
  {
    id: 'products',
    navLink: PRODUCTS,
    title: 'sidebar.sales.products',
    icon: <Package size={12} />,
  },
  {
    id: 'operations',
    navLink: OPERATIONS,
    title: 'sidebar.sales.operations',
    icon: <ShoppingCart size={12} />,
  },
]

export const PlanningLinks: LinkProps[] = [
  {
    id: 'dayOfClasses',
    navLink: DAY_OF_CLASSES,
    title: 'sidebar.planning.dayOfClasses',
    icon: <Calendar size={12} />,
  },
  {
    id: 'timeSlots',
    navLink: TIME_SLOTS,
    title: 'sidebar.planning.timeSlots',
    icon: <Clock size={12} />,
  },
  {
    id: 'distribution',
    navLink: CLASS_DISTRIBUTION,
    title: 'sidebar.planning.distribution',
    icon: <Share2 size={12} />,
  },
]

export const TuitionLinks: LinkProps[] = [
  {
    id: 'feeGroups',
    navLink: FEE_GROUPS,
    title: 'sidebar.sales.feeGroups',
    icon: <Folder size={12} />,
  },
  {
    id: 'feeSlices',
    navLink: INSTALLMENTS,
    title: 'sidebar.sales.installments',
    icon: <Sliders size={12} />,
  },
  {
    id: 'feeStructures',
    navLink: FEE_STRUCTURES,
    title: 'sidebar.sales.structure',
    icon: <Layers size={12} />,
  },
]

export const operationLinks: LinkProps[] = [
  {
    id: 'operations',
    navLink: OPERATIONS,
    title: 'sidebar.sales.operations',
    icon: <ShoppingCart size={12} />,
  },
  {
    id: 'customers',
    navLink: CUSTOMERS,
    title: 'sidebar.sales.customers',
    icon: <Users size={12} />,
  },
  {
    id: 'items',
    navLink: PRODUCTS,
    title: 'sidebar.sales.products',
    icon: <Package size={12} />,
  },
  {
    id: 'frequents',
    navLink: '/frequents',
    title: 'sidebar.students.frequents',
    icon: <UserCheck size={12} />,
  },
]

export const expenseLinks: LinkProps[] = [
  {
    id: 'expenses',
    navLink: EXPENSES,
    title: 'sidebar.expenses',
    icon: <TrendingDown size={12} />,
  },
  {
    id: 'expenseCategories',
    navLink: EXPENSE_CATEGORIES,
    title: 'sidebar.expenses.categories',
    icon: <Tag size={12} />,
  },
]

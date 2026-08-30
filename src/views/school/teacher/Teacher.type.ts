export default interface TeacherType {
  id?: number;
  lastName: string;
  firstName?: string;
  displayName?: string;
  gender: any;
  active: boolean;
  note?: string;
  address: {
    street?: string;
    state?: string;
    town?: string;
    country?: string;
    zipCode?: string;
  };
  contactInfo: {
    telephone?: string;
    mobile?: string;
    email?: string;
    postOfficeBox?: string;
    fax?: string;
  };
  // personnel fields
  code?: string;
  civility?: string;
  birthDate: any;
  birthplace?: string;
  status?: any;
  personnelType?: string;
  bloodGroup?: string;
  rhesus?: string;
  religion?: string;
  ethnicGroup?: string;
  departureDate: any;
  maritalStatus?: any;
  fatherName?: string;
  fatherProfession?: string;
  motherName?: string;
  motherProfession?: string;
  childrenCount?: number | string;
  rank?: string;
  origin: {
    countryOrigin?: string;
    departmentOrigin?: string;
    regionOrigin?: string;
    districtOrigin?: string;
  };
  registrationNumber?: string;
  currentPicture?: string | null;
  grading?: string;
  category?: string;
  clazz?: string;
  administrationEntryDate: any;
  firstServiceDate: any;
  firstServicePlace?: string;
  schoolServiceDate: any;
  function?: string;
  currentPost?: string;
  spouseProfession?: string;
  schoolCharge?: string;
  numberAssignment?: string;
  cniNumber?: string;
  //Teacher fields
  dueHours?: number | string;
  speciality?: string;
  academicDiploma?: string;
  academicYear?: string;
  academicPlace?: string;
  professionalYear?: string;
  professionalPlace?: string;
  professionalDiploma?: string;
  subjectDepartmentCollection: any;
  subjectDepartmentIds: any;
  __typename: string;
}

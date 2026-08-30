interface BaseFormProps {
  action: (variables: any) => Promise<any>;
  onCloseModal: () => void;
  onModalClose?: () => void;
  popover?: boolean;
  modal?: any; //NiceModalHandler<Record<string, unknown>>
  loading: boolean;
  refetch?: Function;
}

interface CommonTableProps {
  dataSource?: any[];
  onGlobalFilterChanged?: (filterApi: any) => void;
  modal?: any;
  onRowSelected?: (data: any[]) => void;
  rowSelection?: any;
  setRowSelection?: any;
  refetch?: Function;
  loading?: boolean;
}

interface Person {
  id?: number;
  displayName: string;
  lastName?: string;
  firstName?: string;
}

interface Enterprise {
  id?: number;
  name: string;
  //schoolCategory: string;
}

interface Address {
  state?: string;
  street?: string;
  town?: string;
  zipCode?: string;
  country?: string;
}

interface ContactInfo {
  telephone?: string;
  mobile?: string;
  email?: string;
  postOfficeBox?: string;
  fax?: string;
}

interface LegalInfo {
  legalForm?: string;
  taxpayerNumber?: string;
  shareCapital?: string;
  tradeRegister?: string;
}

export interface Student {
  _id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  group: string;
  phone: string;
  funding: string;
  education: string;
  expulsionInfo: string;
  departmentId?: { _id: string; name: string };
  admissionYear?: number;
  orphanStatus?: { order: string; startDate: string; endDate?: string };
  disabilityStatus?: { order: string; startDate: string; endDate?: string };
  ovzStatus?: { order: string; startDate: string; endDate?: string };
  riskGroupSOP?: {
    type: string;
    registrationDate: string;
    deregistrationDate?: string;
  };
  svoStatus?: { document: string; startDate: string; endDate?: string };
  socialScholarship?: { document: string; startDate: string; endDate?: string };
}

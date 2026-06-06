export interface School {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Major {
  id: string;
  schoolId: string;
  code: string;
  name: string;
}

export interface AdmissionBlock {
  id: string;
  majorId: string;
  code: string;
  subjects: string[];
}
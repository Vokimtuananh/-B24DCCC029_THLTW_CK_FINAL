export interface School {
  id: string;
  code: string; // Mã trường (VD: QSQ)
  name: string; // Tên trường
  description?: string;
}

export interface Major {
  id: string;
  schoolId: string;
  code: string; // Mã ngành (VD: 7480201)
  name: string; // Tên ngành
}

export interface AdmissionBlock {
  id: string;
  majorId: string;
  code: string; // Mã tổ hợp (VD: A00, A01)
  subjects: string[]; // Danh sách môn
}
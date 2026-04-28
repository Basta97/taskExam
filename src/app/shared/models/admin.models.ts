export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  details: string;
  createdAt: string;
}

export interface CreateDiplomaRequest {
  title: string;
  description: string;
  image: string;
}

export interface UpdateDiplomaRequest {
  title?: string;
  description?: string;
  image?: string;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  image?: string;
  duration?: number;
  diplomaId?: string;
}

export interface CreateQuestionRequest {
  text: string;
  examId: string;
  answers: { text: string; isCorrect: boolean }[];
}

export interface BulkCreateQuestionsRequest {
  examId: string;
  questions: CreateQuestionRequest[];
}

export interface UpdateQuestionRequest {
  text?: string;
  answers?: { id?: string; text: string; isCorrect: boolean }[];
}

export interface AdminStats {
  totalUsers: number;
  totalExams: number;
  totalDiplomas: number;
  totalSubmissions: number;
  averageScore: number;
}

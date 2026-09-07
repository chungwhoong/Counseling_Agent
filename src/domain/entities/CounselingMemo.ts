export interface CounselingMemo {
  id?: string;
  studentName: string;
  grade: string;
  studentMemo: string;
  parentMemo: string;
  createdAt?: Date;
}

export interface CounselingMemoRequest {
  studentName: string;
  grade: string;
  academicLevel: string;
  academicNote: string;
  peerRelation: string;
  peerNote: string;
  career: string;
  etc: string;
}

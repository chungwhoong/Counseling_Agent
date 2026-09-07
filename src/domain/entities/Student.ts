export type AcademicLevel = "상" | "중상" | "중" | "중하" | "하";
export type PeerRelation = "원만" | "보통" | "어려움";

export interface StudentInfo {
  studentName: string;
  grade: string;
  classNum: string;
  academicLevel: AcademicLevel;
  academicNote: string;
  peerRelation: PeerRelation;
  peerNote: string;
  career: string;
  etc: string;
}

export function validateStudentInfo(info: StudentInfo): string[] {
  const errors: string[] = [];
  if (!info.studentName.trim()) errors.push("학생명을 입력해주세요.");
  if (!info.grade) errors.push("학년을 선택해주세요.");
  if (!info.classNum) errors.push("반을 선택해주세요.");
  if (!info.academicLevel) errors.push("학업성적 수준을 선택해주세요.");
  if (!info.peerRelation) errors.push("교우관계를 선택해주세요.");
  return errors;
}

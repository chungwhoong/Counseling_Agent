import { describe, it, expect } from "vitest";
import { validateStudentInfo } from "@/domain/entities/Student";
import type { StudentInfo } from "@/domain/entities/Student";

const validStudent: StudentInfo = {
  studentName: "홍길동",
  grade: "3학년",
  classNum: "2반",
  academicLevel: "중",
  academicNote: "",
  peerRelation: "원만",
  peerNote: "",
  career: "",
  etc: "",
};

describe("validateStudentInfo", () => {
  it("유효한 학생 정보는 빈 배열을 반환한다", () => {
    expect(validateStudentInfo(validStudent)).toEqual([]);
  });

  it("학생명이 없으면 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, studentName: "" });
    expect(errors).toContain("학생명을 입력해주세요.");
  });

  it("학년이 없으면 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, grade: "" });
    expect(errors).toContain("학년을 선택해주세요.");
  });

  it("반이 없으면 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, classNum: "" });
    expect(errors).toContain("반을 선택해주세요.");
  });

  it("학업성적 수준이 없으면 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, academicLevel: "" as never });
    expect(errors).toContain("학업성적 수준을 선택해주세요.");
  });

  it("교우관계가 없으면 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, peerRelation: "" as never });
    expect(errors).toContain("교우관계를 선택해주세요.");
  });

  it("여러 필드가 비어있으면 여러 오류를 반환한다", () => {
    const errors = validateStudentInfo({ ...validStudent, studentName: "", grade: "" });
    expect(errors).toHaveLength(2);
  });
});

import { test, expect } from "@playwright/test";

test.describe("학생 상담 멘트 생성 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/student-info");
  });

  test("페이지가 정상적으로 로드된다", async ({ page }) => {
    await expect(page.getByText("학생 상담 멘트 생성")).toBeVisible();
    await expect(page.getByPlaceholder("홍길동")).toBeVisible();
  });

  test("필수 항목 미입력 시 오류 메시지가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: /AI 상담 멘트 생성/ }).click();
    await expect(page.getByText("필수 항목")).toBeVisible();
  });
});

test.describe("홈 페이지 플로우", () => {
  test("홈에서 각 모듈로 이동한다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("AI로 더 스마트한")).toBeVisible();

    // 시험지 분석 카드 클릭
    await page.getByText("시험지 이미지 분석").click();
    await expect(page).toHaveURL("/exam-analysis");
  });
});

test.describe("이미지 분석 페이지 플로우", () => {
  test("시험지 분석 페이지가 로드된다", async ({ page }) => {
    await page.goto("/exam-analysis");
    await expect(page.getByText("시험지 이미지 분석")).toBeVisible();
    await expect(page.getByText("사진을 업로드하세요")).toBeVisible();
  });

  test("상담일지 분석 페이지가 로드된다", async ({ page }) => {
    await page.goto("/journal-analysis");
    await expect(page.getByText("상담일지 분석")).toBeVisible();
  });
});

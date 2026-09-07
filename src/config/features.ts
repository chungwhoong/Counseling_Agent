export const FEATURES = {
  studentCounseling: true,
  examAnalysis: true,
  journalAnalysis: true,
  supabaseStorage: true, // Supabase SSR 클라이언트 연동 완료
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag];
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const useOllama = (process.env.USE_OLLAMA ?? "false") === "true";

export const env = {
  useOllama,
  nvidiaApiKey: useOllama ? "" : (process.env.NVIDIA_API_KEY ?? ""),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
  ollamaTextModel: process.env.OLLAMA_TEXT_MODEL ?? "qwen3",
  ollamaVisionModel: process.env.OLLAMA_VISION_MODEL ?? "llava",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
} as const;

import type { HapticFeedbackType } from "@apps-in-toss/web-bridge";

export async function haptic(type: HapticFeedbackType): Promise<void> {
  try {
    const { generateHapticFeedback } = await import("@apps-in-toss/web-framework");
    await generateHapticFeedback({ type });
  } catch {
    // 앱 외부에서는 무시
  }
}

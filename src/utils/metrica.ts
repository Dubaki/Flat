/**
 * Утилита для работы с Яндекс Метрикой
 */

// Замените на ваш реальный ID счетчика
export const METRICA_ID = 108280248;

export const reachGoal = (goalName: string) => {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(METRICA_ID, 'reachGoal', goalName);
    console.log(`[Metrica] Goal reached: ${goalName}`);
  } else {
    console.warn(`[Metrica] Cannot reach goal ${goalName}: ym is not defined`);
  }
};

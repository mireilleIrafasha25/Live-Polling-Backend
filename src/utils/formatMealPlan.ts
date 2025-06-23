type MealDay = {
  day: string; 
  breakfast: string;
  snack: string | string[];
  lunch: string;
  dinner: string;
};

export function formatMealPlanByDay(raw: string | MealDay[]) {
  let parsedPlan: MealDay[];

  try {
    parsedPlan = typeof raw === 'string' ? JSON.parse(raw) : raw;

    const result = parsedPlan.map((entry) => ({
      dayName: entry.day, 
      meals: {
        breakfast: entry.breakfast,
        snack: Array.isArray(entry.snack) ? entry.snack : [entry.snack],
        lunch: entry.lunch,
        dinner: entry.dinner,
      },
    }));

    return result;
  } catch (error) {
    console.error('Failed to format meal plan:', error);
    return [];
  }
}

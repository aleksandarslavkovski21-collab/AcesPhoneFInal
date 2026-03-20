
/**
 * Natural sort for strings containing numbers (e.g., "2GB", "16GB", "128GB")
 */
export const naturalSort = (a: string, b: string): number => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Sorts an array of strings naturally
 */
export const sortOptions = (options: string[]): string[] => {
  return [...options].sort(naturalSort);
};

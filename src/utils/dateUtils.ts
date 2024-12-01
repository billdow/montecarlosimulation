export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return result;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function parseExcelDate(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'number') {
    // Excel stores dates as days since Dec 30, 1899
    const utcDate = new Date(Date.UTC(1899, 11, 30));
    utcDate.setUTCDate(utcDate.getUTCDate() + value);
    return utcDate;
  }
  
  // If it's a string, try to parse it
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format');
  }
  return parsedDate;
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const toNumber = (value: FormDataEntryValue | null) => {
  if (value === null || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();
  return formattedDate;
}

export const toISODateTime = (date?: FormDataEntryValue | null) => {
  if (!date) return null;
  // Set time to start of day in local timezone
  return new Date(`${date}T00:00:00`).toISOString();
};

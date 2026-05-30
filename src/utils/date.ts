import type { PeriodSelection } from '@/types/game';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTodayString(date = new Date()) {
  return formatDate(date);
}

export function getYesterdayString(date = new Date()) {
  return formatDate(new Date(date.getTime() - DAY_IN_MS));
}

export function getStartOfMonthString(date = new Date()) {
  return formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function getEndOfMonthString(date = new Date()) {
  return formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function normalizeDateInput(value: string) {
  const trimmedValue = value.trim();
  const separatedParts = trimmedValue.split(/[-/.\s]+/).filter(Boolean);

  if (separatedParts.length === 3) {
    const [year, month, day] = separatedParts;

    if (/^\d{4}$/.test(year) && /^\d{1,2}$/.test(month) && /^\d{1,2}$/.test(day)) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  const digits = trimmedValue.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export function getPeriodSelectionError(selection: PeriodSelection) {
  if (selection.preset !== 'custom') {
    return null;
  }

  if (selection.startDate && !isValidDateString(selection.startDate)) {
    return '開始日は YYYY-MM-DD 形式の実在する日付で入力してください。';
  }

  if (selection.endDate && !isValidDateString(selection.endDate)) {
    return '終了日は YYYY-MM-DD 形式の実在する日付で入力してください。';
  }

  if (selection.startDate && selection.endDate && selection.startDate > selection.endDate) {
    return '開始日は終了日以前の日付にしてください。';
  }

  return null;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateString(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function getMonthRange(referenceDate: Date, offset: 0 | -1) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + offset;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

export function resolvePeriodRange(selection: PeriodSelection, referenceDate = new Date()) {
  if (selection.preset === 'all') {
    return null;
  }

  if (selection.preset === 'thisMonth') {
    return getMonthRange(referenceDate, 0);
  }

  if (selection.preset === 'lastMonth') {
    return getMonthRange(referenceDate, -1);
  }

  if (getPeriodSelectionError(selection)) {
    return null;
  }

  return {
    startDate: selection.startDate || null,
    endDate: selection.endDate || null,
  };
}

export function isDateInRange(date: string, startDate: string | null, endDate: string | null) {
  return (!startDate || date >= startDate) && (!endDate || date <= endDate);
}

export function getPeriodConditionLabel(selection: PeriodSelection) {
  const range = resolvePeriodRange(selection);

  if (!range) {
    return '全期間';
  }

  if (range.startDate && range.endDate) {
    return `${range.startDate}〜${range.endDate}`;
  }

  if (range.startDate) {
    return `${range.startDate}以降`;
  }

  if (range.endDate) {
    return `${range.endDate}以前`;
  }

  return '全期間';
}

export function getPreviousDayString(date = new Date()) {
  return formatDate(new Date(date.getTime() - DAY_IN_MS));
}

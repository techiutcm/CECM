/** Edad mínima para admisión (Preescolar y niveles superiores). */
export const BIRTH_DATE_MIN_AGE_YEARS = 2;

/** Edad mínima para cuidado maternal. */
export const BIRTH_DATE_MATERNAL_MIN_AGE_YEARS = 1;

/** Edad máxima razonable para un aspirante escolar. */
export const BIRTH_DATE_MAX_AGE_YEARS = 25;

export const BIRTH_DATE_DISPLAY_FORMAT = "DD/MM/AAAA";

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toIso({ year, month, day }: DateParts) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function parseIso(value: string): DateParts | null {
  const match = value.trim().match(ISO_DATE_REGEX);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidCalendarDate({ year, month, day })) return null;
  return { year, month, day };
}

function parseDisplay(value: string): DateParts | null {
  const match = value.trim().match(DISPLAY_DATE_REGEX);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (!isValidCalendarDate({ year, month, day })) return null;
  return { year, month, day };
}

function isValidCalendarDate({ year, month, day }: DateParts) {
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAgeInYears(birth: DateParts, reference = new Date()) {
  const ref = startOfLocalDay(reference);
  const birthDate = new Date(birth.year, birth.month - 1, birth.day);

  let age = ref.getFullYear() - birthDate.getFullYear();
  const monthDiff = ref.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export interface BirthDateValidationOptions {
  maternalCare?: boolean;
}

export function getBirthDateMinAgeYears(options: BirthDateValidationOptions = {}) {
  return options.maternalCare
    ? BIRTH_DATE_MATERNAL_MIN_AGE_YEARS
    : BIRTH_DATE_MIN_AGE_YEARS;
}

export function getBirthDateBounds(
  reference = new Date(),
  options: BirthDateValidationOptions = {},
) {
  const minAgeYears = getBirthDateMinAgeYears(options);
  const today = startOfLocalDay(reference);

  const minDate = new Date(
    today.getFullYear() - BIRTH_DATE_MAX_AGE_YEARS,
    today.getMonth(),
    today.getDate(),
  );
  const maxDate = new Date(
    today.getFullYear() - minAgeYears,
    today.getMonth(),
    today.getDate(),
  );

  const minParts: DateParts = {
    year: minDate.getFullYear(),
    month: minDate.getMonth() + 1,
    day: minDate.getDate(),
  };
  const maxParts: DateParts = {
    year: maxDate.getFullYear(),
    month: maxDate.getMonth() + 1,
    day: maxDate.getDate(),
  };

  return {
    minIso: toIso(minParts),
    maxIso: toIso(maxParts),
    minDisplay: isoToDisplay(toIso(minParts)),
    maxDisplay: isoToDisplay(toIso(maxParts)),
    minAgeYears,
  };
}

export function isoToDisplay(iso: string) {
  const parts = parseIso(iso);
  if (!parts) return "";
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`;
}

export function displayToIso(display: string) {
  const parts = parseDisplay(display);
  if (!parts) return null;
  return toIso(parts);
}

export function normalizeBirthDateToIso(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const fromIso = parseIso(trimmed);
  if (fromIso) return toIso(fromIso);

  const fromDisplay = parseDisplay(trimmed);
  if (fromDisplay) return toIso(fromDisplay);

  return null;
}

export function formatBirthDateDisplay(value: string | null | undefined) {
  if (!value?.trim()) return "—";

  const iso = normalizeBirthDateToIso(value);
  if (!iso) return value;

  return isoToDisplay(iso);
}

export function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function validateBirthDateIso(
  value: string,
  options: BirthDateValidationOptions = {},
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Ingresa la fecha de nacimiento";

  const parts = parseIso(trimmed);
  if (!parts) {
    return `Usa el formato ${BIRTH_DATE_DISPLAY_FORMAT} con una fecha válida`;
  }

  const bounds = getBirthDateBounds(new Date(), options);
  const iso = toIso(parts);
  const minAgeYears = bounds.minAgeYears;

  if (iso > bounds.maxIso) {
    return options.maternalCare
      ? "El niño o la niña debe tener al menos 1 año de edad"
      : `El aspirante debe tener al menos ${BIRTH_DATE_MIN_AGE_YEARS} años`;
  }

  if (iso < bounds.minIso) {
    return `La edad no puede superar los ${BIRTH_DATE_MAX_AGE_YEARS} años`;
  }

  const age = getAgeInYears(parts);
  if (age < minAgeYears) {
    return options.maternalCare
      ? "El niño o la niña debe tener al menos 1 año de edad"
      : `El aspirante debe tener al menos ${BIRTH_DATE_MIN_AGE_YEARS} años`;
  }

  return null;
}

export function getBirthDateHelperText(options: BirthDateValidationOptions = {}) {
  if (options.maternalCare) {
    return `Formato ${BIRTH_DATE_DISPLAY_FORMAT}. Edad mínima para cuidado maternal: 1 año.`;
  }

  return `Formato ${BIRTH_DATE_DISPLAY_FORMAT}.`;
}

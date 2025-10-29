import dayjsLib from "dayjs";
import utc from "dayjs/plugin/utc";

dayjsLib.extend(utc);

export const dayjs = dayjsLib;

export const toIso = (input?: Date | string | number | null) => {
  if (!input) return null;
  return dayjs(input).toISOString();
};

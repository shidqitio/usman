import { DateTime } from 'luxon';
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Jakarta");

const generateDateIso = (): string => {
  const now = DateTime.now();
  const formattedDate : any = now.toISO();

  return formattedDate;
}

const generateDate = (): string => {
  const formattedDateTime = moment().format("YYYY-MM-DDTHH:mm:ssZ");
  if (formattedDateTime === null) {
    throw new Error("Gagal mengambil waktu.");
  }
  return formattedDateTime;
};

const generateTime = (): string => {
  const time = moment().format("HH:mm:ss");
  return time;
};

const generateYearMonth = (): string => {
  const yearMonth = moment().format("YYYYMM");

  return yearMonth;
};

const generateTanggal = (time: string) => {
  const dateTime = new Date(time);

  // Membuat objek tanggal untuk mendapatkan tanggal dan waktu yang tepat
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateFormatted = dateTime.toLocaleDateString("id-ID", optionsDate);

  // Membuat objek waktu untuk mendapatkan waktu dalam format 24 jam
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Format 24 jam
  };

  const timeFormatted = dateTime
    .toLocaleTimeString("id-ID", optionsTime)
    .replace(/\./g, ":");

  const formattedTime = `${dateFormatted} | ${timeFormatted} WIB`;
  return formattedTime;
};

export { 
  generateDateIso, 
  generateDate, 
  generateTime, 
  generateYearMonth, 
  generateTanggal 
};

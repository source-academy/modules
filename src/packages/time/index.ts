/**
 * Sample time module for CP3108 22/02/2020 Show N Tell
 * @author Loh Xian Ze, Bryan
 */

import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(isLeapYear);
dayjs.extend(localizedFormat);
dayjs.extend(durationPlugin);

/**
 * Get the current date and time.
 * @param parameter - Parameter to initialize date with
 */
function now(parameter?: any): dayjs.Dayjs {
  return dayjs(parameter);
}

/**
 * Creates a duration with the specified parameters
 * @param number - Number of the specified type
 * @param type - Seconds / Minutes / Hours
 */
function make_duration(
  number: number,
  type: 'seconds' | 'minutes' | 'hours'
): durationPlugin.Duration {
  return dayjs.duration(number, type);
}

function time_stringify(time: dayjs.Dayjs): string {
  return time.format('L LT');
}

function time_compare_to(time1: dayjs.Dayjs, time2: dayjs.Dayjs): number {
  if (time1.isBefore(time2)) return -1;
  if (time1.isAfter(time2)) return 1;
  return 0;
}

function time_add(
  time: dayjs.Dayjs,
  duration: durationPlugin.Duration
): dayjs.Dayjs {
  return time.add(duration);
}

function time_subtract(
  time: dayjs.Dayjs,
  duration: durationPlugin.Duration
): dayjs.Dayjs {
  return time.subtract(duration);
}

function time_is_leap_year(time: dayjs.Dayjs): boolean {
  return time.isLeapYear();
}

/**
 * A function is exported for JS-Slang library to consume.
 */
export default function () {
  return {
    now,
    make_duration,
    time_stringify,
    time_compare_to,
    time_is_leap_year,
    time_add,
    time_subtract,
  };
}

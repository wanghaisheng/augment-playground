// src/utils/dateUtils.ts

/**
 * 格式化日期为易读的字符串（不包含时间）
 * @param dateString 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string | Date): string {
  return formatTime(dateString, false);
}

/**
 * 格式化日期时间为易读的字符串
 * @param dateString 日期字符串或Date对象
 * @param includeTime 是否包含时间部分
 * @returns 格式化后的日期时间字符串
 */
export function formatTime(dateString: string | Date, includeTime: boolean = true): string {
  if (!dateString) return '';

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // 格式化日期部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dateFormatted = `${year}-${month}-${day}`;

  // 如果不需要时间部分，直接返回日期
  if (!includeTime) {
    return dateFormatted;
  }

  // 格式化时间部分
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${dateFormatted} ${hours}:${minutes}`;
}

/**
 * 计算两个日期之间的天数差
 * @param date1 第一个日期
 * @param date2 第二个日期，默认为当前日期
 * @returns 天数差
 */
export function daysBetween(date1: Date | string, date2: Date | string = new Date()): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  // 将时间部分设置为0，只比较日期部分
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // 计算毫秒差并转换为天数
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 检查日期是否是今天
 * @param date 要检查的日期
 * @returns 是否是今天
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * 获取相对时间描述（例如：刚刚、5分钟前、1小时前等）
 * @param date 日期
 * @returns 相对时间描述
 */
export function getRelativeTimeDescription(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const diffMs = now.getTime() - targetDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return formatTime(targetDate, false);
  }
}

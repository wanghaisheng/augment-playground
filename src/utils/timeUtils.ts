// src/utils/timeUtils.ts

/**
 * 时间工具函数
 * 提供与时间相关的实用函数
 */

/**
 * 将秒数转换为时分秒格式
 * @param seconds 秒数
 * @returns 格式化后的时间字符串 (HH:MM:SS)
 */
export function formatSeconds(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

/**
 * 将秒数转换为人类可读的时间格式
 * @param seconds 秒数
 * @param shortFormat 是否使用短格式 (例如: 1h 30m 而不是 1 hour 30 minutes)
 * @returns 人类可读的时间字符串
 */
export function formatSecondsHumanReadable(seconds: number, shortFormat: boolean = false): string {
  if (isNaN(seconds) || seconds < 0) {
    return shortFormat ? '0s' : '0 seconds';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(shortFormat ? `${hours}h` : `${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(shortFormat ? `${minutes}m` : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(shortFormat ? `${secs}s` : `${secs} ${secs === 1 ? 'second' : 'seconds'}`);
  }

  return parts.join(' ');
}

/**
 * 计算两个时间之间的差异（毫秒）
 * @param startTime 开始时间
 * @param endTime 结束时间，默认为当前时间
 * @returns 时间差（毫秒）
 */
export function getTimeDifference(startTime: Date | string, endTime: Date | string = new Date()): number {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;

  return end.getTime() - start.getTime();
}

/**
 * 计算剩余时间（毫秒）
 * @param endTime 结束时间
 * @param startTime 开始时间，默认为当前时间
 * @returns 剩余时间（毫秒），如果已过期则返回0
 */
export function getRemainingTime(endTime: Date | string, startTime: Date | string = new Date()): number {
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;

  const diff = end.getTime() - start.getTime();
  return Math.max(0, diff);
}

/**
 * 格式化剩余时间为人类可读的格式
 * @param milliseconds 剩余的毫秒数
 * @param includeSeconds 是否包含秒数
 * @returns 格式化后的剩余时间字符串
 */
export function formatRemainingTime(milliseconds: number, includeSeconds: boolean = true): string {
  if (milliseconds <= 0) {
    return '已结束';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天 ${hours % 24}小时`;
  } else if (hours > 0) {
    return `${hours}小时 ${minutes % 60}分钟`;
  } else if (minutes > 0) {
    return includeSeconds
      ? `${minutes}分钟 ${seconds % 60}秒`
      : `${minutes}分钟`;
  } else {
    return `${seconds}秒`;
  }
}

/**
 * 检查时间是否已过期
 * @param time 要检查的时间
 * @param currentTime 当前时间，默认为当前时间
 * @returns 是否已过期
 */
export function isExpired(time: Date | string, currentTime: Date | string = new Date()): boolean {
  const targetTime = typeof time === 'string' ? new Date(time) : time;
  const now = typeof currentTime === 'string' ? new Date(currentTime) : currentTime;

  return targetTime.getTime() < now.getTime();
}

/**
 * 添加时间
 * @param date 原始日期
 * @param amount 要添加的数量
 * @param unit 时间单位 ('seconds' | 'minutes' | 'hours' | 'days')
 * @returns 新的日期对象
 */
export function addTime(
  date: Date | string,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
): Date {
  const result = typeof date === 'string' ? new Date(date) : new Date(date.getTime());

  switch (unit) {
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
  }

  return result;
}

/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * 创建倒计时函数
 * @param endTime 结束时间
 * @param onTick 每次更新时的回调函数
 * @param onComplete 倒计时完成时的回调函数
 * @param interval 更新间隔（毫秒），默认为1000
 * @returns 停止倒计时的函数
 */
export function createCountdown(
  endTime: Date | string,
  onTick: (remainingMs: number) => void,
  onComplete?: () => void,
  interval: number = 1000
): () => void {
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  
  const timer = setInterval(() => {
    const remaining = getRemainingTime(end);
    
    if (remaining <= 0) {
      clearInterval(timer);
      onTick(0);
      if (onComplete) {
        onComplete();
      }
    } else {
      onTick(remaining);
    }
  }, interval);
  
  // 立即执行一次，不等待第一个间隔
  const initialRemaining = getRemainingTime(end);
  onTick(initialRemaining);
  
  // 如果已经过期，立即完成
  if (initialRemaining <= 0 && onComplete) {
    onComplete();
  }
  
  // 返回停止函数
  return () => clearInterval(timer);
}

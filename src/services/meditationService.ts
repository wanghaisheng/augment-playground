// src/services/meditationService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';
import {
  MeditationDifficulty,
  MeditationType,
  type MeditationCourseRecord,
  type MeditationSessionRecord
} from '@/types/meditation';

/**
 * 检查用户是否可以访问VIP冥想课程
 * @param userId 用户ID
 * @returns 是否可以访问VIP冥想课程
 */
export async function canAccessVipMeditations(userId: string): Promise<boolean> {
  return isUserVip(userId);
}

/**
 * 获取所有冥想课程
 * @param includeVipExclusive 是否包含VIP专属课程
 * @returns 冥想课程列表
 */
export async function getAllMeditationCourses(includeVipExclusive: boolean = false): Promise<MeditationCourseRecord[]> {
  if (includeVipExclusive) {
    return db.meditationCourses
      .filter((course: MeditationCourseRecord) => course.isActive === true)
      .toArray();
  } else {
    return db.meditationCourses
      .filter((course: MeditationCourseRecord) => course.isActive === true && !course.isVipExclusive)
      .toArray();
  }
}

/**
 * 获取用户可访问的冥想课程
 * @param userId 用户ID
 * @returns 冥想课程列表
 */
export async function getAccessibleMeditationCourses(userId: string): Promise<MeditationCourseRecord[]> {
  const canAccessVip = await canAccessVipMeditations(userId);
  return getAllMeditationCourses(canAccessVip);
}

/**
 * 获取VIP专属冥想课程
 * @returns VIP专属冥想课程列表
 */
export async function getVipMeditationCourses(): Promise<MeditationCourseRecord[]> {
  return db.meditationCourses
    .filter((course: MeditationCourseRecord) => course.isVipExclusive === true && course.isActive === true)
    .toArray();
}

/**
 * 获取冥想课程
 * @param courseId 课程ID
 * @returns 冥想课程
 */
export async function getMeditationCourse(courseId: number): Promise<MeditationCourseRecord | undefined> {
  return db.meditationCourses.get(courseId);
}

/**
 * 获取用户的冥想会话
 * @param userId 用户ID
 * @returns 冥想会话列表
 */
export async function getUserMeditationSessions(userId: string): Promise<MeditationSessionRecord[]> {
  return db.meditationSessions
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('startTime');
}

/**
 * 获取用户的冥想统计数据
 * @param userId 用户ID
 * @returns 冥想统计数据
 */
export async function getUserMeditationStats(userId: string): Promise<{
  totalSessions: number;
  totalMinutes: number;
  longestStreak: number;
  currentStreak: number;
  completedCourses: number;
}> {
  try {
    // 获取用户的冥想会话
    const sessions = await getUserMeditationSessions(userId);
    
    // 计算总会话数
    const totalSessions = sessions.length;
    
    // 计算总冥想时间（分钟）
    const totalMinutes = sessions.reduce((total, session) => total + session.durationMinutes, 0);
    
    // 计算连续冥想天数
    const sessionDates = sessions
      .filter(session => session.isCompleted)
      .map(session => new Date(session.startTime).toDateString());
    
    const uniqueDates = [...new Set(sessionDates)].map(dateStr => new Date(dateStr));
    uniqueDates.sort((a, b) => a.getTime() - b.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // 计算最长连续天数
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(uniqueDates[i - 1]);
        prevDate.setDate(prevDate.getDate() + 1);
        
        if (prevDate.toDateString() === uniqueDates[i].toDateString()) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    // 计算当前连续天数
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (sessionDates.includes(today)) {
      currentStreak = 1;
      const checkDate = yesterday;
      
      while (true) {
        const checkDateStr = checkDate.toDateString();
        if (sessionDates.includes(checkDateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else if (sessionDates.includes(yesterdayStr)) {
      currentStreak = 1;
      const checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (true) {
        const checkDateStr = checkDate.toDateString();
        if (sessionDates.includes(checkDateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }
    
    // 计算完成的课程数量
    const completedCourseIds = new Set(
      sessions
        .filter(session => session.isCompleted)
        .map(session => session.courseId)
    );
    
    return {
      totalSessions,
      totalMinutes,
      longestStreak,
      currentStreak,
      completedCourses: completedCourseIds.size
    };
  } catch (error) {
    console.error('Failed to get user meditation stats:', error);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      longestStreak: 0,
      currentStreak: 0,
      completedCourses: 0
    };
  }
}

/**
 * 开始冥想会话
 * @param userId 用户ID
 * @param courseId 课程ID
 * @returns 创建的冥想会话
 */
export async function startMeditationSession(
  userId: string,
  courseId: number
): Promise<MeditationSessionRecord> {
  try {
    const course = await getMeditationCourse(courseId);
    if (!course) {
      throw new Error(`Meditation course with ID ${courseId} not found`);
    }

    // Ensure the course has an audio path
    if (typeof course.audioPath !== 'string' || course.audioPath.trim() === '') {
      throw new Error(`Meditation course with ID ${courseId} does not have a valid audio path required for the session.`);
    }
    
    // 检查用户是否可以访问VIP课程
    if (course.isVipExclusive) {
      const canAccess = await canAccessVipMeditations(userId);
      if (!canAccess) {
        throw new Error('User cannot access VIP meditation courses');
      }
    }
    
    // 创建会话
    const now = new Date();
    const session: MeditationSessionRecord = {
      userId,
      courseId,
      audioPath: course.audioPath,
      startTime: now,
      durationMinutes: 0,
      isCompleted: false,
      createdAt: now
    };
    
    // 添加到数据库
    const id = await db.meditationSessions.add(session);
    const createdSession = { ...session, id: id as number };
    
    // 添加到同步队列
    await addSyncItem('meditationSessions', 'create', createdSession);
    
    return createdSession;
  } catch (error) {
    console.error('Failed to start meditation session:', error);
    throw error;
  }
}

/**
 * 完成冥想会话
 * @param sessionId 会话ID
 * @param durationMinutes 持续时间（分钟）
 * @param rating 评分（可选）
 * @param feedback 反馈（可选）
 * @returns 更新后的冥想会话
 */
export async function completeMeditationSession(
  sessionId: number,
  durationMinutes: number,
  rating?: number,
  feedback?: string
): Promise<MeditationSessionRecord> {
  try {
    // 获取会话
    const session = await db.meditationSessions.get(sessionId);
    if (!session) {
      throw new Error(`Meditation session with ID ${sessionId} not found`);
    }
    
    // 更新会话
    const now = new Date();
    const updatedSession: MeditationSessionRecord = {
      ...session,
      endTime: now,
      durationMinutes,
      isCompleted: true,
      rating,
      feedback
    };
    
    // 更新数据库
    await db.meditationSessions.update(sessionId, updatedSession);
    
    // 添加到同步队列
    await addSyncItem('meditationSessions', 'update', updatedSession);
    
    // 更新课程完成次数和评分
    if (rating) {
      await updateCourseRating(session.courseId, rating);
    }
    
    await incrementCourseCompletionCount(session.courseId);
    
    return updatedSession;
  } catch (error) {
    console.error('Failed to complete meditation session:', error);
    throw error;
  }
}

/**
 * 更新课程评分
 * @param courseId 课程ID
 * @param newRating 新评分
 */
async function updateCourseRating(courseId: number, newRating: number): Promise<void> {
  try {
    // 获取课程
    const course = await getMeditationCourse(courseId);
    if (!course) {
      throw new Error(`Meditation course with ID ${courseId} not found`);
    }
    
    // 获取课程的所有评分会话
    const ratedSessions = await db.meditationSessions
      .where('courseId')
      .equals(courseId)
      .and((session: MeditationSessionRecord) => session.rating !== undefined && session.isCompleted)
      .toArray();
    
    // 计算新的平均评分
    const totalRatings = ratedSessions.length + 1; // 包括新评分
    const totalRatingSum = ratedSessions.reduce((sum: number, session: MeditationSessionRecord) => sum + (session.rating || 0), 0) + newRating;
    const newAverageRating = totalRatingSum / totalRatings;
    
    // 更新课程
    await db.meditationCourses.update(courseId, {
      averageRating: newAverageRating,
      updatedAt: new Date()
    });
    
    // 添加到同步队列
    await addSyncItem('meditationCourses', 'update', {
      id: courseId,
      averageRating: newAverageRating,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to update course rating:', error);
  }
}

/**
 * 增加课程完成次数
 * @param courseId 课程ID
 */
async function incrementCourseCompletionCount(courseId: number): Promise<void> {
  try {
    // 获取课程
    const course = await getMeditationCourse(courseId);
    if (!course) {
      throw new Error(`Meditation course with ID ${courseId} not found`);
    }
    
    // 更新课程
    await db.meditationCourses.update(courseId, {
      completionCount: course.completionCount + 1,
      updatedAt: new Date()
    });
    
    // 添加到同步队列
    await addSyncItem('meditationCourses', 'update', {
      id: courseId,
      completionCount: course.completionCount + 1,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to increment course completion count:', error);
  }
}

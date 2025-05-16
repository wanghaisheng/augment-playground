// src/services/meditationInitService.ts
import { db } from '@/db-old';
import {
  MeditationDifficulty,
  MeditationType,
  type MeditationCourseRecord,
  // MeditationSessionRecord is not used in this file, so no need to import it here
} from '@/types/meditation'; // Corrected import path
import { playSound, SoundType } from '@/utils/sound';

/**
 * 初始化冥想课程
 */
export async function initializeMeditationCourses(): Promise<void> {
  try {
    // 检查是否已经初始化
    const existingCourses = await db.table('meditationCourses').toArray();
    if (existingCourses.length > 0) {
      console.log('Meditation courses already initialized');
      return;
    }
    
    // 创建默认冥想课程
    const now = new Date();
    const defaultCourses: Omit<MeditationCourseRecord, 'id'>[] = [
      // 基础课程（非VIP）
      {
        title: '初级呼吸练习',
        description: '学习基础的呼吸技巧，帮助放松和平静心灵。',
        type: MeditationType.BREATHWORK,
        difficulty: MeditationDifficulty.BEGINNER,
        durationMinutes: 10,
        isVipExclusive: false,
        coverImagePath: '/assets/meditation/breathing-awareness.jpg',
        audioPath: '/assets/meditation/audio/breathing-awareness.mp3',
        instructorName: '李静',
        benefits: ['减轻压力', '提高专注力', '改善睡眠'],
        tags: ['初学者', '呼吸', '正念'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '身体扫描放松',
        description: '通过系统地将注意力引导到身体的不同部位，帮助您释放紧张和压力，达到深度放松。',
        type: MeditationType.BODY_SCAN,
        difficulty: MeditationDifficulty.BEGINNER,
        durationMinutes: 10,
        isVipExclusive: false,
        coverImagePath: '/assets/meditation/body-scan.jpg',
        audioPath: '/assets/meditation/audio/body-scan.mp3',
        instructorName: '王平',
        benefits: ['释放身体紧张', '改善身体感知', '促进放松'],
        tags: ['初学者', '放松', '身体感知'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '慈心冥想基础',
        description: '学习如何培养对自己和他人的慈爱和善意，增强情感连接和幸福感。',
        type: MeditationType.LOVING_KINDNESS,
        difficulty: MeditationDifficulty.INTERMEDIATE,
        durationMinutes: 15,
        isVipExclusive: false,
        coverImagePath: '/assets/meditation/loving-kindness.jpg',
        audioPath: '/assets/meditation/audio/loving-kindness.mp3',
        instructorName: '张慧',
        benefits: ['增强同理心', '改善人际关系', '提升幸福感'],
        tags: ['慈心', '情感健康', '中级'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '正念行走冥想',
        description: '将正念带入日常行走中，学习如何在移动中保持觉知和专注。',
        type: MeditationType.MINDFULNESS,
        difficulty: MeditationDifficulty.BEGINNER,
        durationMinutes: 10,
        isVipExclusive: false,
        coverImagePath: '/assets/meditation/walking-meditation.jpg',
        audioPath: '/assets/meditation/audio/walking-meditation.mp3',
        instructorName: '陈明',
        benefits: ['增强身体觉知', '改善专注力', '减轻焦虑'],
        tags: ['行走', '正念', '日常练习'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '晚间放松冥想',
        description: '帮助您在睡前放松身心，改善睡眠质量的引导冥想。',
        type: MeditationType.GUIDED,
        difficulty: MeditationDifficulty.BEGINNER,
        durationMinutes: 15,
        isVipExclusive: false,
        coverImagePath: '/assets/meditation/evening-relaxation.jpg',
        audioPath: '/assets/meditation/audio/evening-relaxation.mp3',
        instructorName: '林睿',
        benefits: ['改善睡眠', '减轻压力', '放松身心'],
        tags: ['睡眠', '放松', '晚间'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      
      // VIP专属高级课程
      {
        title: '高级正念冥想',
        description: 'VIP专属高级课程，深入探索正念冥想技巧，提升觉知和专注力。适合有一定冥想经验的练习者。',
        type: MeditationType.MINDFULNESS,
        difficulty: MeditationDifficulty.ADVANCED,
        durationMinutes: 20,
        isVipExclusive: true,
        coverImagePath: '/assets/meditation/advanced-mindfulness.jpg',
        audioPath: '/assets/meditation/audio/advanced-mindfulness.mp3',
        instructorName: '张慧',
        benefits: ['深度专注', '提升觉知', '情绪调节', '增强内观能力'],
        tags: ['高级', '正念', 'VIP专属', '深度练习'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '禅修冥想体验',
        description: 'VIP专属禅修课程，体验传统禅修技巧，培养无执着的觉知和内心平静。',
        type: MeditationType.ZEN,
        difficulty: MeditationDifficulty.ADVANCED,
        durationMinutes: 25,
        isVipExclusive: true,
        coverImagePath: '/assets/meditation/zen-meditation.jpg',
        audioPath: '/assets/meditation/audio/zen-meditation.mp3',
        instructorName: '李静',
        benefits: ['内心平静', '无执着觉知', '提升智慧', '减少反应性'],
        tags: ['禅修', '高级', 'VIP专属', '传统'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '瑜伽睡眠冥想',
        description: 'VIP专属瑜伽睡眠冥想，一种古老的瑜伽技术，帮助您达到深度放松和意识清晰的状态。',
        type: MeditationType.YOGA_NIDRA,
        difficulty: MeditationDifficulty.INTERMEDIATE,
        durationMinutes: 30,
        isVipExclusive: true,
        coverImagePath: '/assets/meditation/yoga-nidra.jpg',
        audioPath: '/assets/meditation/audio/yoga-nidra.mp3',
        instructorName: '王平',
        benefits: ['深度放松', '改善睡眠', '减轻压力', '增强创造力'],
        tags: ['瑜伽睡眠', '深度放松', 'VIP专属', '恢复'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '超觉冥想技术',
        description: 'VIP专属超觉冥想课程，一种简单而有效的冥想技术，帮助您达到超越思维的纯粹意识状态。',
        type: MeditationType.TRANSCENDENTAL,
        difficulty: MeditationDifficulty.ADVANCED,
        durationMinutes: 20,
        isVipExclusive: true,
        coverImagePath: '/assets/meditation/transcendental.jpg',
        audioPath: '/assets/meditation/audio/transcendental.mp3',
        instructorName: '陈明',
        benefits: ['减轻压力', '提升创造力', '改善认知功能', '增强幸福感'],
        tags: ['超觉冥想', '高级', 'VIP专属', '意识拓展'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        title: '冥想大师课程',
        description: 'VIP专属冥想大师课程，综合多种高级冥想技术，帮助您达到冥想的最高境界。仅适合有丰富冥想经验的练习者。',
        type: MeditationType.GUIDED,
        difficulty: MeditationDifficulty.MASTER,
        durationMinutes: 45,
        isVipExclusive: true,
        coverImagePath: '/assets/meditation/master-class.jpg',
        audioPath: '/assets/meditation/audio/master-class.mp3',
        instructorName: '林睿',
        benefits: ['深度觉知', '意识拓展', '自我转化', '精神成长'],
        tags: ['大师课程', '高级', 'VIP专属', '综合技术'],
        completionCount: 0,
        averageRating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ];
    
    // 批量添加课程
    await db.table('meditationCourses').bulkAdd(defaultCourses);
    
    console.log('Meditation courses initialized successfully');
  } catch (error) {
    console.error('Failed to initialize meditation courses:', error);
  }
}

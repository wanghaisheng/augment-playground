// src/components/meditation/MeditationPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MeditationCourseRecord,
  startMeditationSession,
  completeMeditationSession
} from '@/services/meditationService';
import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

interface MeditationPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  course: MeditationCourseRecord | null;
}

/**
 * 冥想播放器组件
 */
const MeditationPlayer: React.FC<MeditationPlayerProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { refreshTable } = useDataRefreshContext();

  // 如果没有课程，不显示
  if (!course) {
    return null;
  }

  // 初始化音频
  useEffect(() => {
    if (isOpen && course) {
      // 创建音频元素
      const audio = new Audio(course.audioPath);
      audioRef.current = audio;

      // 监听事件
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setShowCompletionMessage(true);
      });

      audio.addEventListener('error', () => {
        console.error('Failed to load audio');
        setIsLoading(false);
      });

      // 开始冥想会话
      const startSession = async () => {
        try {
          // 在实际应用中，这应该是当前用户的ID
          const userId = 'current-user';

          const session = await startMeditationSession(userId, course.id!);
          if (session.id) {
            setSessionId(session.id);
          }
        } catch (error) {
          console.error('Failed to start meditation session:', error);
        }
      };

      startSession();

      // 清理
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('loadedmetadata', () => {});
          audioRef.current.removeEventListener('timeupdate', () => {});
          audioRef.current.removeEventListener('ended', () => {});
          audioRef.current.removeEventListener('error', () => {});
        }
      };
    }
  }, [isOpen, course]);

  // 处理播放/暂停
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      playSound(SoundType.BUTTON_CLICK);
    } else {
      audioRef.current.play();
      playSound(SoundType.BUTTON_CLICK);
    }

    setIsPlaying(!isPlaying);
  };

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 处理关闭
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // 如果会话已开始但未完成，则完成会话
    if (sessionId && !showRating && !showCompletionMessage) {
      const completeSession = async () => {
        try {
          await completeMeditationSession(
            sessionId,
            Math.round(currentTime / 60) // 转换为分钟
          );

          // 刷新数据
          refreshTable('meditationSessions');
          refreshTable('meditationCourses');
        } catch (error) {
          console.error('Failed to complete meditation session:', error);
        }
      };

      completeSession();
    }

    playSound(SoundType.BUTTON_CLICK);
    onClose();
  };

  // 处理完成冥想
  const handleCompleteMeditation = () => {
    setShowRating(true);
    playSound(SoundType.SUCCESS);
  };

  // 处理评分
  const handleRate = (value: number) => {
    setRating(value);
    playSound(SoundType.BUTTON_CLICK);
  };

  // 处理提交评分
  const handleSubmitRating = async () => {
    if (!sessionId) return;

    try {
      setIsSubmitting(true);

      // 完成会话
      await completeMeditationSession(
        sessionId,
        course.durationMinutes,
        rating || undefined,
        feedback || undefined
      );

      // 播放成功音效
      playSound(SoundType.SUCCESS);

      // 刷新数据
      refreshTable('meditationSessions');
      refreshTable('meditationCourses');

      // 关闭评分界面
      setShowRating(false);
      setShowCompletionMessage(true);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      playSound(SoundType.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 获取默认封面图片
  const getDefaultCoverImage = () => {
    return '/assets/meditation/default-cover.jpg';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={course.title}
          showCloseButton={true}
          // size="large" - removed as LatticeDialog doesn't support this prop
        >
          {showRating ? (
            <div className="rating-container p-4">
              <h3 className="text-xl font-bold text-center mb-4">
                冥想完成！请评价您的体验
              </h3>

              <div className="rating-stars flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    className={`text-3xl mx-1 focus:outline-none ${
                      rating && value <= rating ? 'text-gold-500' : 'text-gray-300'
                    }`}
                    onClick={() => handleRate(value)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="feedback-input mb-6">
                <label className="block text-gray-700 mb-2">
                  反馈（可选）
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={4}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="分享您的冥想体验..."
                />
              </div>

              <div className="flex justify-center">
                <Button
                  variant="jade"
                  onClick={handleSubmitRating}
                  disabled={!rating || isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner variant="white" size="small" />
                  ) : (
                    '提交'
                  )}
                </Button>
              </div>
            </div>
          ) : showCompletionMessage ? (
            <div className="completion-message p-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <span className="text-6xl">🧘</span>
              </motion.div>

              <h3 className="text-xl font-bold text-jade-700 mb-2">
                恭喜您完成冥想！
              </h3>

              <p className="text-gray-600 mb-6">
                感谢您参与这次冥想体验。希望您感到放松和平静。
              </p>

              <div className="benefits mb-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  您获得了以下好处：
                </h4>
                <ul className="text-sm text-gray-600">
                  {course.benefits.map((benefit, index) => (
                    <li key={index} className="mb-1">
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="jade"
                onClick={handleClose}
              >
                完成
              </Button>
            </div>
          ) : (
            <div className="meditation-player p-4">
              {/* 封面图片 */}
              <div className="cover-image mb-6">
                <img
                  src={course.coverImagePath || getDefaultCoverImage()}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* 播放控制 */}
              <div className="player-controls mb-6">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner variant="jade" size="medium" />
                  </div>
                ) : (
                  <>
                    {/* 进度条 */}
                    <div
                      className="progress-bar h-2 bg-gray-200 rounded-full mb-2 cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-2 bg-jade-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>

                    {/* 时间显示 */}
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* 播放按钮 */}
                    <div className="flex justify-center">
                      <button
                        className="play-button w-16 h-16 bg-jade-500 text-white rounded-full flex items-center justify-center focus:outline-none"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 课程信息 */}
              <div className="course-info mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    <span className="mr-1">🕒</span>
                    {course.durationMinutes} 分钟
                  </span>
                  <span>
                    <span className="mr-1">👤</span>
                    {course.instructorName}
                  </span>
                </div>
              </div>

              {/* 完成按钮 */}
              <div className="flex justify-center">
                <Button
                  variant="jade"
                  onClick={handleCompleteMeditation}
                >
                  完成冥想
                </Button>
              </div>
            </div>
          )}
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default MeditationPlayer;

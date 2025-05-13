// src/components/game/SocialChallengeForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SocialChallengeRecord, 
  SocialChallengeType,
  createSocialChallenge
} from '@/services/socialChallengeService';
import { ChallengeDifficulty, ChallengeStatus } from '@/services/challengeService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from './ScrollDialog';

interface SocialChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated?: (challenge: SocialChallengeRecord) => void;
}

/**
 * 社交挑战表单组件
 * 用于创建新的社交挑战
 */
const SocialChallengeForm: React.FC<SocialChallengeFormProps> = ({
  isOpen,
  onClose,
  onChallengeCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SocialChallengeType>(SocialChallengeType.COOPERATIVE);
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(ChallengeDifficulty.MEDIUM);
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [iconPath, setIconPath] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入挑战标题');
      return;
    }
    
    if (!description.trim()) {
      setError('请输入挑战描述');
      return;
    }
    
    if (!startDate) {
      setError('请选择开始日期');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 创建社交挑战
      const challenge = await createSocialChallenge({
        title: title.trim(),
        description: description.trim(),
        type,
        difficulty,
        status: ChallengeStatus.ACTIVE,
        creatorId: 'current-user', // 在实际应用中，这应该是当前用户的ID
        maxParticipants,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        iconPath: iconPath || undefined,
        isPublic
      });
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 重置表单
      resetForm();
      
      // 通知父组件
      if (onChallengeCreated) {
        onChallengeCreated(challenge);
      }
      
      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('Failed to create social challenge:', err);
      setError('创建挑战失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType(SocialChallengeType.COOPERATIVE);
    setDifficulty(ChallengeDifficulty.MEDIUM);
    setMaxParticipants(5);
    setIsPublic(true);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setIconPath('');
    setError(null);
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="创建社交挑战"
      closeOnOutsideClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      showCloseButton={!isSubmitting}
    >
      <div className="social-challenge-form p-4">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message text-red-500 mb-4 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          {/* 挑战标题 */}
          <div className="form-group mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              挑战标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              placeholder="输入挑战标题"
              required
            />
          </div>
          
          {/* 挑战描述 */}
          <div className="form-group mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              挑战描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500 h-24"
              placeholder="输入挑战描述"
              required
            />
          </div>
          
          {/* 挑战类型 */}
          <div className="form-group mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              挑战类型 <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as SocialChallengeType)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              required
            >
              <option value={SocialChallengeType.COOPERATIVE}>合作型</option>
              <option value={SocialChallengeType.COMPETITIVE}>竞争型</option>
              <option value={SocialChallengeType.TEAM}>团队型</option>
            </select>
          </div>
          
          {/* 挑战难度 */}
          <div className="form-group mb-4">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              挑战难度 <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as ChallengeDifficulty)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              required
            >
              <option value={ChallengeDifficulty.EASY}>简单</option>
              <option value={ChallengeDifficulty.MEDIUM}>中等</option>
              <option value={ChallengeDifficulty.HARD}>困难</option>
              <option value={ChallengeDifficulty.EXPERT}>专家</option>
            </select>
          </div>
          
          {/* 最大参与人数 */}
          <div className="form-group mb-4">
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              最大参与人数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              min={2}
              max={20}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              required
            />
          </div>
          
          {/* 是否公开 */}
          <div className="form-group mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-jade-600 focus:ring-jade-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                公开挑战（任何人都可以加入）
              </label>
            </div>
          </div>
          
          {/* 日期选择 */}
          <div className="form-group mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                开始日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                结束日期
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              />
            </div>
          </div>
          
          {/* 图标路径 */}
          <div className="form-group mb-4">
            <label htmlFor="iconPath" className="block text-sm font-medium text-gray-700 mb-1">
              图标路径
            </label>
            <input
              type="text"
              id="iconPath"
              value={iconPath}
              onChange={(e) => setIconPath(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              placeholder="/assets/challenges/social_default.svg"
            />
          </div>
          
          {/* 提交按钮 */}
          <div className="form-actions flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              variant="jade"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                '创建挑战'
              )}
            </Button>
          </div>
        </form>
      </div>
    </ScrollDialog>
  );
};

export default SocialChallengeForm;

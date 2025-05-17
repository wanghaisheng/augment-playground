// src/components/goals/CustomGoalForm.tsx
import React, { useState, useEffect } from 'react';

import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchCustomGoalFormView } from '@/services/localizedContentService';
import { playSound, SoundType } from '@/utils/sound';
import {
  createCustomGoal,
  CustomGoalType,
  CustomGoalStatus,
  canCreateCustomGoal,
  getCustomGoalLimit,
  getCustomGoalCount
} from '@/services/customGoalService';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { usePandaState } from '@/context/PandaStateProvider';
import { useNavigate } from 'react-router-dom';

interface CustomGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 自定义目标表单组件
 */
const CustomGoalForm: React.FC<CustomGoalFormProps> = ({
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CustomGoalType>(CustomGoalType.DAILY);
  const [targetValue, setTargetValue] = useState<number>(1);
  const [isPublic, setIsPublic] = useState(false);
  const [endDate, setEndDate] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canCreate, setCanCreate] = useState(true);
  const [goalLimit, setGoalLimit] = useState(1);
  const [goalCount, setGoalCount] = useState(0);

  const { labels } = useLocalizedView('customGoalForm', fetchCustomGoalFormView);
  const { refreshData } = useDataRefreshContext();
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const navigate = useNavigate();

  // 加载用户的自定义目标限制和数量
  useEffect(() => {
    const loadGoalLimits = async () => {
      try {
        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
        const limit = await getCustomGoalLimit(userId);
        const count = await getCustomGoalCount(userId);
        const canCreateNew = await canCreateCustomGoal(userId);

        setGoalLimit(limit);
        setGoalCount(count);
        setCanCreate(canCreateNew);
      } catch (error) {
        console.error('Failed to load goal limits:', error);
        setError('无法加载目标限制');
      }
    };

    if (isOpen) {
      loadGoalLimits();
    }
  }, [isOpen]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // 验证表单
      if (!title.trim()) {
        setError('请输入目标标题');
        return;
      }

      if (targetValue <= 0) {
        setError('目标值必须大于0');
        return;
      }

      // 创建自定义目标
      const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
      const now = new Date();

      // 计算结束日期
      let goalEndDate: Date | undefined;
      if (endDate) {
        goalEndDate = new Date(endDate);
      } else {
        // 根据目标类型设置默认结束日期
        switch (type) {
          case CustomGoalType.DAILY:
            goalEndDate = new Date(now);
            goalEndDate.setDate(goalEndDate.getDate() + 1);
            break;
          case CustomGoalType.WEEKLY:
            goalEndDate = new Date(now);
            goalEndDate.setDate(goalEndDate.getDate() + 7);
            break;
          case CustomGoalType.MONTHLY:
            goalEndDate = new Date(now);
            goalEndDate.setMonth(goalEndDate.getMonth() + 1);
            break;
          case CustomGoalType.YEARLY:
            goalEndDate = new Date(now);
            goalEndDate.setFullYear(goalEndDate.getFullYear() + 1);
            break;
        }
      }

      // 创建目标
      await createCustomGoal({
        userId,
        title,
        description,
        type,
        status: CustomGoalStatus.ACTIVE,
        targetValue,
        currentValue: 0,
        startDate: now,
        endDate: goalEndDate,
        isPublic
      });

      // 播放音效
      playSound(SoundType.SUCCESS);

      // 刷新数据
      refreshData('customGoals');

      // 关闭表单
      onClose();
    } catch (error) {
      console.error('Failed to create custom goal:', error);
      setError('创建自定义目标失败');
      playSound(SoundType.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  return (
    <LatticeDialog
      isOpen={isOpen}
      onClose={onClose}
      title={labels?.title || '创建自定义目标'}
      showCloseButton={!isSubmitting}
      closeOnOutsideClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      <div className="custom-goal-form">
        {!canCreate ? (
          <div className="goal-limit-reached p-4 bg-gray-50 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {labels?.limitReachedTitle || '已达到自定义目标限制'}
            </h3>
            <p className="text-gray-600 mb-4">
              {labels?.limitReachedDescription?.replace('{count}', goalCount.toString())
                                              .replace('{limit}', goalLimit.toString()) ||
               `您已创建了 ${goalCount} 个自定义目标，达到了 ${goalLimit} 个的限制。`}
            </p>

            {!isVip && (
              <div className="vip-promotion p-4 bg-gold-50 border border-gold-200 rounded-lg mb-4">
                <h4 className="font-medium text-gold-700 flex items-center">
                  <span className="mr-1">★</span>
                  {labels?.vipPromotionTitle || 'VIP会员特权'}
                </h4>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  {labels?.vipPromotionDescription || 'VIP会员可以创建多达5个自定义目标，助您更好地追踪多个领域的进步。'}
                </p>
                <Button
                  variant="gold"
                  onClick={handleNavigateToVip}
                  className="w-full"
                >
                  {labels?.upgradeButton || '升级到VIP'}
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                {labels?.closeButton || '关闭'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="form-group mb-4">
              <label htmlFor="goal-title" className="block text-gray-700 font-medium mb-1">
                {labels?.titleLabel || '目标标题'} *
              </label>
              <input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                placeholder={labels?.titlePlaceholder || '输入您的目标标题'}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="goal-description" className="block text-gray-700 font-medium mb-1">
                {labels?.descriptionLabel || '目标描述'}
              </label>
              <textarea
                id="goal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                placeholder={labels?.descriptionPlaceholder || '描述您的目标（可选）'}
                rows={3}
              />
            </div>

            <div className="form-row flex flex-wrap gap-4 mb-4">
              <div className="form-group flex-1 min-w-[200px]">
                <label htmlFor="goal-type" className="block text-gray-700 font-medium mb-1">
                  {labels?.typeLabel || '目标类型'} *
                </label>
                <select
                  id="goal-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as CustomGoalType)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                >
                  <option value={CustomGoalType.DAILY}>{labels?.typeDaily || '每日目标'}</option>
                  <option value={CustomGoalType.WEEKLY}>{labels?.typeWeekly || '每周目标'}</option>
                  <option value={CustomGoalType.MONTHLY}>{labels?.typeMonthly || '每月目标'}</option>
                  <option value={CustomGoalType.YEARLY}>{labels?.typeYearly || '年度目标'}</option>
                  <option value={CustomGoalType.CUSTOM}>{labels?.typeCustom || '自定义'}</option>
                </select>
              </div>

              <div className="form-group flex-1 min-w-[200px]">
                <label htmlFor="goal-target" className="block text-gray-700 font-medium mb-1">
                  {labels?.targetLabel || '目标值'} *
                </label>
                <input
                  id="goal-target"
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="goal-end-date" className="block text-gray-700 font-medium mb-1">
                {labels?.endDateLabel || '结束日期'}
              </label>
              <input
                id="goal-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {labels?.endDateHint || '如果不设置，将根据目标类型自动设置结束日期'}
              </p>
            </div>

            <div className="form-group mb-6">
              <div className="flex items-center">
                <input
                  id="goal-public"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-jade-600 focus:ring-jade-500 border-gray-300 rounded"
                />
                <label htmlFor="goal-public" className="ml-2 block text-gray-700">
                  {labels?.publicLabel || '公开此目标'}
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                {labels?.publicHint || '公开目标将在社区中可见，您的朋友可以为您加油'}
              </p>
            </div>

            <div className="goal-limit-info bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                {labels?.goalLimitInfo?.replace('{count}', goalCount.toString())
                                      .replace('{limit}', goalLimit.toString()) ||
                 `您已创建了 ${goalCount} 个自定义目标，共 ${goalLimit} 个限制`}
                {!isVip && (
                  <span className="ml-1">
                    - <button
                      type="button"
                      className="text-gold-600 hover:underline"
                      onClick={handleNavigateToVip}
                    >
                      {labels?.becomeVipButton || '成为VIP会员'}
                    </button> {labels?.vipBenefitHint || '可创建更多目标'}
                  </span>
                )}
              </p>
            </div>

            <div className="form-actions flex justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {labels?.cancelButton || '取消'}
              </Button>

              <Button
                variant="jade"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner variant="white" size="small" />
                ) : (
                  labels?.createButton || '创建目标'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </LatticeDialog>
  );
};

export default CustomGoalForm;

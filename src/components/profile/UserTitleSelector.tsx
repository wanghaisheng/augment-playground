// src/components/profile/UserTitleSelector.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getUserTitles,
  activateUserTitle,
  UserTitleRecord,
  UserTitleType
} from '@/services/userTitleService';
import { usePandaState } from '@/context/PandaStateProvider';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import LatticeDialog from '@/components/game/LatticeDialog';
import { fetchUserTitleSelectorView } from '@/services/localizedContentService';
import { useLanguage } from '@/context/LanguageProvider';

interface UserTitleSelectorProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 用户称号选择器组件
 *
 * 允许用户选择和激活称号
 */
const UserTitleSelector: React.FC<UserTitleSelectorProps> = ({
  userId,
  isOpen,
  onClose
}) => {
  const [titles, setTitles] = useState<UserTitleRecord[]>([]);
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const { language } = useLanguage();

  // 本地化视图
  const { labels } = useLocalizedView(
    'userTitleSelectorViewContent',
    fetchUserTitleSelectorView
  );

  const { refreshTable } = useDataRefreshContext();

  // 加载用户称号
  useEffect(() => {
    const loadTitles = async () => {
      try {
        setIsLoading(true);
        const userTitles = await getUserTitles(userId);
        setTitles(userTitles);

        // 设置当前激活的称号为选中状态
        const activeTitle = userTitles.find(title => title.isActive);
        if (activeTitle && activeTitle.id !== undefined) {
          setSelectedTitleId(activeTitle.id);
        }
      } catch (error) {
        console.error('Failed to load user titles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadTitles();
    }
  }, [userId, isOpen]);

  // 处理称号选择
  const handleTitleSelect = (titleId: number) => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedTitleId(titleId);
  };

  // 处理称号激活
  const handleActivateTitle = async () => {
    if (!selectedTitleId) return;

    try {
      setIsSaving(true);
      playSound(SoundType.CONFIRM);

      await activateUserTitle(selectedTitleId);

      // 刷新数据
      refreshTable('userTitles');

      // 关闭对话框
      onClose();
    } catch (error) {
      console.error('Failed to activate title:', error);
      playSound(SoundType.ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  // 根据称号类型获取图标
  const getTitleIcon = (titleType: UserTitleType) => {
    switch (titleType) {
      case UserTitleType.GUARDIAN:
        return '/assets/titles/guardian.svg';
      case UserTitleType.BAMBOO_GUARDIAN:
        return '/assets/titles/bamboo_guardian.svg';
      case UserTitleType.PANDA_MASTER:
        return '/assets/titles/panda_master.svg';
      case UserTitleType.MEDITATION_MASTER:
        return '/assets/titles/meditation_master.svg';
      case UserTitleType.TASK_MASTER:
        return '/assets/titles/task_master.svg';
      case UserTitleType.CHALLENGE_CHAMPION:
        return '/assets/titles/challenge_champion.svg';
      case UserTitleType.COLLECTOR:
        return '/assets/titles/collector.svg';
      case UserTitleType.CUSTOM:
        return '/assets/titles/custom.svg';
      default:
        return '/assets/titles/default.svg';
    }
  };

  // 获取本地化的称号文本
  const getLocalizedTitleText = (title: UserTitleRecord) => {
    const key = `title_${title.titleType.toLowerCase()}`;
    return labels?.[key]?.[language] || title.titleText;
  };

  // 获取本地化的称号描述
  const getLocalizedTitleDescription = (title: UserTitleRecord) => {
    const key = `description_${title.titleType.toLowerCase()}`;
    return labels?.[key]?.[language] || '';
  };

  // 渲染称号列表
  const renderTitleList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jade-500"></div>
        </div>
      );
    }

    if (titles.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {labels?.noTitlesMessage?.[language] || '您还没有解锁任何称号'}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-1">
        {titles.map(title => {
          const isDisabled = title.isVipExclusive && !isVip;
          const isSelected = selectedTitleId === title.id;

          return (
            <motion.div
              key={title.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-jade-500 bg-jade-50'
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-jade-300'
              }`}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isDisabled && handleTitleSelect(title.id!)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  title.isVipExclusive ? 'bg-gold-50' : 'bg-gray-100'
                }`}>
                  <img src={getTitleIcon(title.titleType)} alt="" className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className={`font-medium ${
                      title.isVipExclusive ? 'text-gold-600' : 'text-jade-600'
                    }`}>
                      {getLocalizedTitleText(title)}
                    </h3>

                    {title.isVipExclusive && (
                      <span className="ml-2 text-gold-500 text-sm">★ VIP</span>
                    )}

                    {title.isActive && (
                      <span className="ml-2 text-jade-500 text-xs bg-jade-50 px-1.5 py-0.5 rounded">
                        {labels?.activeLabel?.[language] || '已激活'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {getLocalizedTitleDescription(title)}
                  </p>
                </div>
              </div>

              {isDisabled && (
                <div className="mt-2 text-sm text-gold-600 bg-gold-50 p-2 rounded">
                  {labels?.vipRequiredMessage?.[language] || '需要VIP会员才能使用此称号'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <LatticeDialog
      isOpen={isOpen}
      onClose={onClose}
      title={labels?.dialogTitle?.[language] || '选择称号'}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            {labels?.cancelButton?.[language] || '取消'}
          </Button>

          <Button
            variant="filled"
            color="jade"
            onClick={handleActivateTitle}
            disabled={!selectedTitleId || isSaving}
            isLoading={isSaving}
          >
            {labels?.confirmButton?.[language] || '激活称号'}
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <p className="text-gray-600">
          {labels?.dialogDescription?.[language] || '选择一个称号来展示您的成就和身份。'}
        </p>
      </div>

      {renderTitleList()}

      {!isVip && (
        <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-lg">
          <h3 className="font-medium text-gold-700 flex items-center">
            <span className="mr-1">★</span>
            {labels?.vipTitlesHeader?.[language] || 'VIP专属称号'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {labels?.vipTitlesDescription?.[language] || '成为VIP会员解锁专属称号，彰显您的独特身份。'}
          </p>
          <Button
            variant="gold"
            className="mt-2 w-full"
            onClick={() => {
              onClose();
              window.location.href = '/vip-benefits';
            }}
          >
            {labels?.becomeVipButton?.[language] || '了解VIP特权'}
          </Button>
        </div>
      )}
    </LatticeDialog>
  );
};

export default UserTitleSelector;

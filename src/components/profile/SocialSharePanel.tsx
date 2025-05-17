// src/components/profile/SocialSharePanel.tsx
import React, { useState, useRef } from 'react';
import { UserProfile, UserAchievement, UserStatistics } from '@/types/user';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import html2canvas from 'html2canvas';
import { fetchSocialShareView } from '@/services/localizedContentService';
import { useLanguage } from '@/context/LanguageProvider';

// 组件属性
interface SocialSharePanelProps {
  profile: UserProfile | null;
  achievements: UserAchievement[];
  statistics: UserStatistics | null;
}

/**
 * 社交分享面板组件
 *
 * 允许用户分享个人资料、成就和统计数据到社交媒体
 */
const SocialSharePanel: React.FC<SocialSharePanelProps> = ({
  profile,
  achievements,
  statistics
}) => {
  // 状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [shareType, setShareType] = useState<'profile' | 'achievements' | 'statistics'>('profile');
  const [isCopied, setIsCopied] = useState(false);

  // 引用
  const shareCardRef = useRef<HTMLDivElement>(null);

  // 获取语言
  const { language } = useLanguage();

  // 本地化视图
  const { labels } = useLocalizedView(
    'socialShareViewContent',
    fetchSocialShareView
  );

  // 如果没有个人资料，不显示分享面板
  if (!profile) {
    return null;
  }

  // 处理分享类型切换
  const handleShareTypeChange = (type: typeof shareType) => {
    playSound(SoundType.BUTTON_CLICK);
    setShareType(type);
    setShareImage(null);
  };

  // 处理生成分享图片
  const handleGenerateImage = async () => {
    if (!shareCardRef.current) return;

    try {
      setIsGenerating(true);
      playSound(SoundType.BUTTON_CLICK);

      // 生成图片
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      // 转换为数据URL
      const dataUrl = canvas.toDataURL('image/png');

      // 设置分享图片
      setShareImage(dataUrl);

      // 播放成功音效
      playSound(SoundType.SUCCESS);
    } catch (error) {
      console.error('Failed to generate share image:', error);

      // 播放错误音效
      playSound(SoundType.ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理下载图片
  const handleDownloadImage = () => {
    if (!shareImage) return;

    playSound(SoundType.BUTTON_CLICK);

    // 创建下载链接
    const link = document.createElement('a');
    link.href = shareImage;
    link.download = `panda-habit-${shareType}-share.png`;
    link.click();
  };

  // 处理复制图片
  const handleCopyImage = async () => {
    if (!shareImage) return;

    try {
      playSound(SoundType.BUTTON_CLICK);

      // 创建Blob对象
      const response = await fetch(shareImage);
      const blob = await response.blob();

      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      // 设置复制状态
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      // 播放成功音效
      playSound(SoundType.SUCCESS);
    } catch (error) {
      console.error('Failed to copy image:', error);

      // 播放错误音效
      playSound(SoundType.ERROR);
    }
  };

  // 处理分享到社交媒体
  const handleShareToSocial = (platform: 'weibo' | 'wechat' | 'qq') => {
    playSound(SoundType.BUTTON_CLICK);

    // 获取分享文本
    let shareText = '';

    switch (shareType) {
      case 'profile':
        shareText = `${labels?.shareTexts?.profile?.[language] || '查看我的熊猫习惯个人资料！等级 ' + profile.level}`;
        break;
      case 'achievements':
        shareText = `${labels?.shareTexts?.achievements?.[language] || '我在熊猫习惯中解锁了 ' + achievements.filter(a => a.unlocked).length + ' 个成就！'}`;
        break;
      case 'statistics':
        shareText = `${labels?.shareTexts?.statistics?.[language] || '查看我的熊猫习惯统计数据！已完成 ' + (statistics?.tasks.completed || 0) + ' 个任务'}`;
        break;
    }

    // 根据平台执行不同的分享操作
    switch (platform) {
      case 'weibo':
        window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'wechat':
        alert(labels?.wechatShareTip?.[language] || '请截图后在微信中分享');
        break;
      case 'qq':
        window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`, '_blank');
        break;
    }
  };

  // 渲染个人资料分享卡片
  const renderProfileShareCard = () => (
    <div className="profile-share-card bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="w-16 h-16 rounded-full border-4"
          style={{ borderColor: profile.themeColor }}
        />
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-800">{profile.displayName}</h3>
          <p className="text-gray-600">@{profile.username}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">{labels?.level?.[language] || '等级'}</div>
        <div className="flex items-center">
          <span className="text-lg font-bold text-jade-600 mr-2">Lv.{profile.level}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-jade-500 h-2.5 rounded-full"
              style={{
                width: `${(profile.experience / profile.nextLevelExperience) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">{labels?.bio?.[language] || '个人简介'}</div>
        <p className="text-gray-700">{profile.bio || '这个用户很懒，还没有填写个人简介...'}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-jade-600">
            {achievements.filter(a => a.unlocked).length}
          </div>
          <div className="text-xs text-gray-500">{labels?.achievements?.[language] || '成就'}</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-jade-600">
            {statistics?.tasks.completed || 0}
          </div>
          <div className="text-xs text-gray-500">{labels?.tasksCompleted?.[language] || '已完成任务'}</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-jade-600">
            {statistics?.tasks.streak || 0}
          </div>
          <div className="text-xs text-gray-500">{labels?.currentStreak?.[language] || '连续天数'}</div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        {labels?.poweredBy?.[language] || '由熊猫习惯提供支持'}
      </div>
    </div>
  );

  // 渲染成就分享卡片
  const renderAchievementsShareCard = () => {
    // 获取已解锁的成就
    const unlockedAchievements = achievements.filter(a => a.unlocked).slice(0, 4);

    return (
      <div className="achievements-share-card bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: profile.themeColor }}
          />
          <div className="ml-3">
            <h3 className="text-lg font-bold text-gray-800">{profile.displayName}</h3>
            <p className="text-xs text-gray-600">Lv.{profile.level}</p>
          </div>
        </div>

        <h4 className="text-lg font-bold text-jade-600 mb-3">
          {labels?.myAchievements?.[language] || '我的成就'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </span>
        </h4>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
              <img
                src={achievement.iconUrl}
                alt={achievement.name}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-jade-400 to-jade-600 p-1"
              />
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-800">{achievement.name}</div>
                <div className="text-xs text-gray-500">{new Date(achievement.unlockedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          {labels?.poweredBy?.[language] || '由熊猫习惯提供支持'}
        </div>
      </div>
    );
  };

  // 渲染统计数据分享卡片
  const renderStatisticsShareCard = () => (
    <div className="statistics-share-card bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: profile.themeColor }}
        />
        <div className="ml-3">
          <h3 className="text-lg font-bold text-gray-800">{profile.displayName}</h3>
          <p className="text-xs text-gray-600">Lv.{profile.level}</p>
        </div>
      </div>

      <h4 className="text-lg font-bold text-jade-600 mb-3">
        {labels?.myStatistics?.[language] || '我的统计数据'}
      </h4>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="stat-item">
          <div className="text-sm text-gray-500 mb-1">{labels?.tasksCompleted?.[language] || '已完成任务'}</div>
          <div className="text-2xl font-bold text-jade-600">{statistics?.tasks.completed || 0}</div>
        </div>

        <div className="stat-item">
          <div className="text-sm text-gray-500 mb-1">{labels?.currentStreak?.[language] || '连续天数'}</div>
          <div className="text-2xl font-bold text-jade-600">{statistics?.tasks.streak || 0}</div>
        </div>

        <div className="stat-item">
          <div className="text-sm text-gray-500 mb-1">{labels?.longestStreak?.[language] || '最长连续天数'}</div>
          <div className="text-2xl font-bold text-jade-600">{statistics?.tasks.longestStreak || 0}</div>
        </div>

        <div className="stat-item">
          <div className="text-sm text-gray-500 mb-1">{labels?.achievementsUnlocked?.[language] || '已解锁成就'}</div>
          <div className="text-2xl font-bold text-jade-600">{statistics?.achievements.unlocked || 0}</div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        {labels?.poweredBy?.[language] || '由熊猫习惯提供支持'}
      </div>
    </div>
  );

  return (
    <div className="social-share-panel bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {labels?.title?.[language] || '分享到社交媒体'}
      </h2>

      {/* 分享类型选择 */}
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-l-lg ${
            shareType === 'profile'
              ? 'bg-jade-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleShareTypeChange('profile')}
        >
          {labels?.shareTypes?.profile?.[language] || '个人资料'}
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            shareType === 'achievements'
              ? 'bg-jade-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleShareTypeChange('achievements')}
        >
          {labels?.shareTypes?.achievements?.[language] || '成就'}
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-r-lg ${
            shareType === 'statistics'
              ? 'bg-jade-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleShareTypeChange('statistics')}
        >
          {labels?.shareTypes?.statistics?.[language] || '统计数据'}
        </button>
      </div>

      {/* 分享卡片预览 */}
      <div className="mb-6">
        <div ref={shareCardRef} className="max-w-md mx-auto">
          {shareType === 'profile' && renderProfileShareCard()}
          {shareType === 'achievements' && renderAchievementsShareCard()}
          {shareType === 'statistics' && renderStatisticsShareCard()}
        </div>
      </div>

      {/* 分享操作 */}
      <div className="space-y-4">
        {!shareImage ? (
          <Button
            variant="jade"
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating
              ? (labels?.generating?.[language] || '生成图片中...')
              : (labels?.generateImage?.[language] || '生成分享图片')}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={handleDownloadImage}
                className="flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {labels?.download?.[language] || '下载'}
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleCopyImage}
                className="flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {isCopied ? (labels?.copied?.[language] || '已复制') : (labels?.copy?.[language] || '复制')}
                </span>
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handleShareToSocial('weibo')}
                className="flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 14.87c-.94-.5-1.58-.84-1.09-1.52.5-.67.55-1.87 0-2.49-.51-.6-1.9-.58-3.5-.17 0 0-.5.14-.37-.18.24-.81.22-1.49-.17-1.88-.86-.88-3.16.07-5.13 2.05-1.47 1.47-2.33 3.04-2.33 4.4 0 2.57 3.28 4.14 6.5 4.14 4.23 0 7.04-2.44 7.04-4.38 0-.55-.48-1.24-1.95-1.97zM12.5 18.12c-2.57.26-4.77-.87-4.93-2.53-.16-1.66 1.79-3.21 4.36-3.48 2.57-.26 4.77.87 4.93 2.53.16 1.66-1.79 3.22-4.36 3.48z" />
                    <path d="M13.37 14.27c-.12-.23-.39-.32-.6-.22-.21.1-.28.37-.16.59.12.23.39.32.6.22.21-.1.28-.37.16-.59z" />
                    <path d="M12.07 14.67c-.32-.32-.85-.46-1.33-.32-.47.14-.68.56-.49.9.19.33.7.5 1.17.36.48-.14.82-.52.65-.94z" />
                    <path d="M6.56 9.5c.19-.52-.14-1.12-.74-1.34-.59-.21-1.22.04-1.41.56-.19.52.14 1.12.74 1.34.59.21 1.22-.04 1.41-.56z" />
                    <path d="M21.85 9.29c-.24-.55-.95-.75-1.53-.42-.58.33-.83.98-.58 1.53.24.55.95.75 1.53.42.58-.33.83-.98.58-1.53z" />
                    <path d="M21.95 7.57c-1.21-1.34-2.99-1.85-4.66-1.85-3.83 0-6.95 2.58-6.95 5.76 0 1.86 1.2 3.54 3.06 4.62-.14.34-.27.67-.38.98-.11.33-.09.45.09.45s.39-.19.67-.45c.16-.15.36-.36.58-.59.5.12 1.03.19 1.58.19 3.83 0 6.95-2.58 6.95-5.76 0-1.19-.49-2.31-1.35-3.23l.41-.12z" />
                  </svg>
                  {labels?.shareToWeibo?.[language] || '微博'}
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleShareToSocial('wechat')}
                className="flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 13.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6.5 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                    <path d="M16.12 5.27c-2.17-.46-4.3-.45-6.24.26-3.95 1.46-5.24 5.24-3.36 8.13 1.14 1.74 3.09 2.97 5.18 3.21.89.1 1.08.82.62 1.52-.46.7-.94 1.37-1.41 2.05-.3.44.16.95.66.74 1.14-.46 2.23-1.03 3.27-1.71.5-.33 1.09-.24 1.64-.07 3.64 1.15 7.2-.2 8.58-3.21.99-2.15.66-4.94-1.62-6.9-1.14-.99-2.66-1.67-4.27-1.99-.33-.06-1.72-.32-3.05-.03z" />
                  </svg>
                  {labels?.shareToWechat?.[language] || '微信'}
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleShareToSocial('qq')}
                className="flex-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.07 4.5c-4.07 0-7.38 2.67-7.38 5.95 0 .34.04.67.09 1-.43.24-.9.59-1.27 1.04-.42.51-.74 1.04-.74 1.43 0 .26.15.46.35.57.21.11.46.11.7.03.46-.14 1.19-.51 1.8-1.07-.03.32-.05.64-.05.97 0 1.26.56 2.43 1.5 3.39-.16.52-.35 1.02-.56 1.47-.21.44-.43.84-.43 1.13 0 .25.15.45.35.56.2.11.44.12.66.05.74-.25 1.97-1.36 2.77-2.5 1.21.42 2.57.67 4.01.67 4.07 0 7.37-2.67 7.37-5.95 0-3.28-3.3-5.95-7.37-5.95z" />
                  </svg>
                  {labels?.shareToQQ?.[language] || 'QQ'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSharePanel;

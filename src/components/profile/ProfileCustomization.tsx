// src/components/profile/ProfileCustomization.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, UserTitle } from '@/types/user';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import { activateUserTitle } from '@/services/userTitleService';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

// 组件属性
interface ProfileCustomizationProps {
  profile: UserProfile | null;
  titles: UserTitle[];
  activeTitle: string | null;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
}

/**
 * 个人资料个性化设置组件
 * 
 * 允许用户自定义个人资料的外观和隐私设置
 */
const ProfileCustomization: React.FC<ProfileCustomizationProps> = ({
  profile,
  titles,
  activeTitle,
  onSave
}) => {
  // 状态
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(profile);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(activeTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'appearance' | 'privacy'>('appearance');
  
  // 上下文
  const { refreshData } = useDataRefreshContext();
  
  // 本地化视图
  const { content } = useLocalizedView('profileCustomization');
  
  // 预设背景图片列表
  const backgroundOptions = [
    '/assets/images/backgrounds/background-1.jpg',
    '/assets/images/backgrounds/background-2.jpg',
    '/assets/images/backgrounds/background-3.jpg',
    '/assets/images/backgrounds/background-4.jpg',
    '/assets/images/backgrounds/background-5.jpg',
    '/assets/images/backgrounds/background-6.jpg'
  ];
  
  // 预设主题颜色列表
  const themeColorOptions = [
    '#4CAF50', // 翡翠绿
    '#2196F3', // 青花蓝
    '#9C27B0', // 紫檀紫
    '#F44336', // 朱砂红
    '#FF9800', // 琥珀黄
    '#795548'  // 檀木棕
  ];
  
  // 当profile变化时更新editedProfile
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);
  
  // 当activeTitle变化时更新selectedTitle
  useEffect(() => {
    setSelectedTitle(activeTitle);
  }, [activeTitle]);
  
  // 如果没有个人资料，显示加载状态
  if (!profile || !editedProfile) {
    return (
      <div className="profile-customization bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-jade-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {content?.loading || '加载个性化设置中...'}
          </h3>
        </div>
      </div>
    );
  }
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // 处理隐私设置复选框
      setEditedProfile({
        ...editedProfile,
        privacySettings: {
          ...editedProfile.privacySettings,
          [name.replace('privacy_', '')]: checked
        }
      });
    } else {
      // 处理其他输入
      setEditedProfile({
        ...editedProfile,
        [name]: value
      });
    }
  };
  
  // 处理背景图片选择
  const handleBackgroundSelect = (backgroundUrl: string) => {
    playSound(SoundType.BUTTON_CLICK);
    
    setEditedProfile({
      ...editedProfile,
      backgroundImageUrl: backgroundUrl
    });
  };
  
  // 处理主题颜色选择
  const handleThemeColorSelect = (color: string) => {
    playSound(SoundType.BUTTON_CLICK);
    
    setEditedProfile({
      ...editedProfile,
      themeColor: color
    });
  };
  
  // 处理称号选择
  const handleTitleSelect = async (titleId: string) => {
    playSound(SoundType.BUTTON_CLICK);
    
    try {
      setIsSaving(true);
      
      // 激活称号
      await activateUserTitle(titleId);
      
      // 更新选中的称号
      setSelectedTitle(titleId);
      
      // 刷新数据
      refreshData('userTitles');
      
      // 播放成功音效
      playSound(SoundType.SUCCESS);
    } catch (error) {
      console.error('Failed to activate title:', error);
      
      // 播放错误音效
      playSound(SoundType.ERROR);
    } finally {
      setIsSaving(false);
    }
  };
  
  // 处理保存
  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      setIsSaving(true);
      playSound(SoundType.BUTTON_CLICK);
      
      // 保存个人资料
      await onSave(editedProfile);
      
      // 播放成功音效
      playSound(SoundType.SUCCESS);
    } catch (error) {
      console.error('Failed to save profile customization:', error);
      
      // 播放错误音效
      playSound(SoundType.ERROR);
    } finally {
      setIsSaving(false);
    }
  };
  
  // 处理标签切换
  const handleTabChange = (tab: 'appearance' | 'privacy') => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedTab(tab);
  };
  
  // 获取称号名称
  const getTitleName = (titleId: string) => {
    const title = titles.find(t => t.id === titleId);
    return title ? title.name : '';
  };
  
  return (
    <div className="profile-customization bg-white rounded-lg shadow-md p-6">
      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            selectedTab === 'appearance'
              ? 'text-jade-600 border-b-2 border-jade-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('appearance')}
        >
          {content?.tabs?.appearance || '外观'}
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            selectedTab === 'privacy'
              ? 'text-jade-600 border-b-2 border-jade-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('privacy')}
        >
          {content?.tabs?.privacy || '隐私'}
        </button>
      </div>
      
      {/* 外观设置 */}
      {selectedTab === 'appearance' && (
        <div className="appearance-settings">
          {/* 背景图片选择 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              {content?.backgroundImage || '背景图片'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {backgroundOptions.map((bgUrl, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden h-24 ${
                    editedProfile.backgroundImageUrl === bgUrl ? 'ring-2 ring-jade-500' : ''
                  }`}
                  onClick={() => handleBackgroundSelect(bgUrl)}
                >
                  <img
                    src={bgUrl}
                    alt={`Background ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {editedProfile.backgroundImageUrl === bgUrl && (
                    <div className="absolute top-2 right-2 bg-jade-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 主题颜色选择 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              {content?.themeColor || '主题颜色'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {themeColorOptions.map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full cursor-pointer ${
                    editedProfile.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleThemeColorSelect(color)}
                >
                  {editedProfile.themeColor === color && (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <input
                  type="color"
                  name="themeColor"
                  value={editedProfile.themeColor}
                  onChange={handleInputChange}
                  className="w-full h-full cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* 称号选择 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              {content?.title || '称号'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {titles.map((title) => (
                <motion.div
                  key={title.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedTitle === title.id
                      ? 'border-jade-500 bg-jade-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => handleTitleSelect(title.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={title.iconUrl}
                      alt=""
                      className="w-8 h-8 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{title.name}</div>
                      <div className="text-xs text-gray-500">{title.unlockCondition}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* 保存按钮 */}
          <div className="mt-6">
            <Button
              variant="jade"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (content?.saving || '保存中...') : (content?.save || '保存设置')}
            </Button>
          </div>
        </div>
      )}
      
      {/* 隐私设置 */}
      {selectedTab === 'privacy' && (
        <div className="privacy-settings">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy_showAchievements"
                name="privacy_showAchievements"
                checked={editedProfile.privacySettings.showAchievements}
                onChange={handleInputChange}
                className="w-4 h-4 text-jade-600 border-gray-300 rounded focus:ring-jade-500"
              />
              <label htmlFor="privacy_showAchievements" className="ml-2 block text-sm text-gray-700">
                {content?.showAchievements || '显示我的成就'}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy_showStatistics"
                name="privacy_showStatistics"
                checked={editedProfile.privacySettings.showStatistics}
                onChange={handleInputChange}
                className="w-4 h-4 text-jade-600 border-gray-300 rounded focus:ring-jade-500"
              />
              <label htmlFor="privacy_showStatistics" className="ml-2 block text-sm text-gray-700">
                {content?.showStatistics || '显示我的统计数据'}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy_showLevel"
                name="privacy_showLevel"
                checked={editedProfile.privacySettings.showLevel}
                onChange={handleInputChange}
                className="w-4 h-4 text-jade-600 border-gray-300 rounded focus:ring-jade-500"
              />
              <label htmlFor="privacy_showLevel" className="ml-2 block text-sm text-gray-700">
                {content?.showLevel || '显示我的等级'}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy_showSocialLinks"
                name="privacy_showSocialLinks"
                checked={editedProfile.privacySettings.showSocialLinks}
                onChange={handleInputChange}
                className="w-4 h-4 text-jade-600 border-gray-300 rounded focus:ring-jade-500"
              />
              <label htmlFor="privacy_showSocialLinks" className="ml-2 block text-sm text-gray-700">
                {content?.showSocialLinks || '显示我的社交链接'}
              </label>
            </div>
          </div>
          
          {/* 保存按钮 */}
          <div className="mt-6">
            <Button
              variant="jade"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (content?.saving || '保存中...') : (content?.save || '保存设置')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCustomization;

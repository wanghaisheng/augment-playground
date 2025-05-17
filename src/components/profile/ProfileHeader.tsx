// src/components/profile/ProfileHeader.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, UserTitle } from '@/types/user';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';

// 组件属性
interface ProfileHeaderProps {
  profile: UserProfile | null;
  title: string | null;
  titles: UserTitle[];
  isEditing: boolean;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

/**
 * 个人资料头部组件
 *
 * 显示用户头像、名称、等级和称号，并提供编辑功能
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  title,
  titles,
  isEditing,
  onSave,
  onCancel,
  isSaving
}) => {
  // 编辑状态
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(profile);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile?.avatarUrl || '');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(title);

  // 预设头像列表
  const avatarOptions = [
    '/assets/images/avatars/avatar-1.png',
    '/assets/images/avatars/avatar-2.png',
    '/assets/images/avatars/avatar-3.png',
    '/assets/images/avatars/avatar-4.png',
    '/assets/images/avatars/avatar-5.png',
    '/assets/images/avatars/avatar-6.png'
  ];

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedProfile) return;

    const { name, value } = e.target;

    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  // 处理头像选择
  const handleAvatarSelect = (avatarUrl: string) => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedAvatar(avatarUrl);

    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        avatarUrl
      });
    }
  };

  // 处理称号选择
  const handleTitleSelect = (titleId: string | null) => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedTitle(titleId);
  };

  // 处理保存
  const handleSave = async () => {
    if (!editedProfile) return;

    // 保存编辑后的资料
    await onSave(editedProfile);
  };

  // 获取称号名称
  const getTitleName = (titleId: string | null): string => {
    if (!titleId) return '无称号';

    const foundTitle = titles.find(t => t.id === titleId);
    return foundTitle ? foundTitle.name : '无称号';
  };

  // 获取等级进度百分比
  const getLevelProgressPercentage = (): number => {
    if (!profile) return 0;

    const { experience, nextLevelExperience } = profile;
    return Math.min(100, Math.round((experience / nextLevelExperience) * 100));
  };

  // 如果没有资料，显示加载中
  if (!profile) {
    return (
      <div className="profile-header bg-gray-100 rounded-lg p-4 mb-6 animate-pulse">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div className="ml-4 flex-1">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 查看模式
  if (!isEditing) {
    return (
      <div className="profile-header bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          {/* 头像 */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-jade-500 mb-4 sm:mb-0"
            style={{ backgroundColor: profile.themeColor }}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 用户信息 */}
          <div className="ml-0 sm:ml-6 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              {profile.displayName}
              {selectedTitle && (
                <span className="ml-2 text-sm font-normal text-jade-600 bg-jade-50 px-2 py-1 rounded-full">
                  {getTitleName(selectedTitle)}
                </span>
              )}
            </h2>

            <p className="text-gray-600 text-sm mb-2">@{profile.username}</p>

            {/* 等级进度条 */}
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Lv.{profile.level}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-jade-500 h-2.5 rounded-full"
                  style={{ width: `${getLevelProgressPercentage()}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {profile.experience}/{profile.nextLevelExperience} XP
              </span>
            </div>

            {/* 个人简介 */}
            <p className="text-gray-700 mt-2">
              {profile.bio || '这个用户很懒，还没有填写个人简介...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 编辑模式
  return (
    <div className="profile-header bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col">
        {/* 头像选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            头像
          </label>
          <div className="flex flex-wrap gap-2">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                  selectedAvatar === avatar ? 'border-jade-500' : 'border-gray-200'
                }`}
                onClick={() => handleAvatarSelect(avatar)}
              >
                <img
                  src={avatar}
                  alt={`Avatar option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 称号选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            称号
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                selectedTitle === null ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleTitleSelect(null)}
            >
              无称号
            </button>
            {titles.filter(t => t.unlocked).map((title) => (
              <button
                key={title.id}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTitle === title.id ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
                onClick={() => handleTitleSelect(title.id)}
              >
                {title.name}
              </button>
            ))}
          </div>
        </div>

        {/* 显示名称 */}
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            显示名称
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={editedProfile?.displayName || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jade-500"
            maxLength={20}
          />
        </div>

        {/* 个人简介 */}
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            个人简介
          </label>
          <textarea
            id="bio"
            name="bio"
            value={editedProfile?.bio || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jade-500"
            rows={3}
            maxLength={200}
          />
        </div>

        {/* 主题颜色 */}
        <div className="mb-4">
          <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-1">
            主题颜色
          </label>
          <input
            type="color"
            id="themeColor"
            name="themeColor"
            value={editedProfile?.themeColor || '#4CAF50'}
            onChange={handleInputChange}
            className="w-full h-10 p-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* 按钮 */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outlined"
            color="silk"
            onClick={onCancel}
            disabled={isSaving}
          >
            取消
          </Button>
          <Button
            variant="jade"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="保存中..."
          >
            保存资料
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

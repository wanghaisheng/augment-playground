// src/components/reflection/EnhancedReflectionDetailDialog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReflectionRecord,
  getReflection,
  updateReflection,
  completeReflection,
  ReflectionStatus
} from '@/services/reflectionService';
import { formatDate } from '@/utils/dateUtils';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EnhancedReflectionForm from './EnhancedReflectionForm';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';

interface EnhancedReflectionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reflectionId: number;
  onReflectionUpdated?: () => void;
  onReflectionCompleted?: (reflection: ReflectionRecord) => void;
  labels?: {
    title?: string;
    tabs?: {
      details?: string;
      actions?: string;
    };
    buttons?: {
      complete?: string;
      edit?: string;
      delete?: string;
      close?: string;
      retry?: string;
    };
    fields?: {
      mood?: string;
      tags?: string;
      createdAt?: string;
      completedAt?: string;
      content?: string;
      action?: string;
    };
    errors?: {
      loadFailed?: string;
      completeFailed?: string;
      notFound?: string;
    };
  };
}

/**
 * 增强版反思详情对话框组件
 * 用于显示反思详情，支持多语言和动画
 * 
 * @param isOpen - 是否打开对话框
 * @param onClose - 关闭对话框回调
 * @param reflectionId - 反思ID
 * @param onReflectionUpdated - 反思更新回调
 * @param onReflectionCompleted - 反思完成回调
 * @param labels - 本地化标签
 */
const EnhancedReflectionDetailDialog: React.FC<EnhancedReflectionDetailDialogProps> = ({
  isOpen,
  onClose,
  reflectionId,
  onReflectionUpdated,
  onReflectionCompleted,
  labels: propLabels
}) => {
  const [reflection, setReflection] = useState<ReflectionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'actions'>('details');
  const [isEditing, setIsEditing] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.reflectionDetail?.title || "Reflection Details",
    tabs: {
      details: propLabels?.tabs?.details || componentLabels?.reflectionDetail?.tabs?.details || "Details",
      actions: propLabels?.tabs?.actions || componentLabels?.reflectionDetail?.tabs?.actions || "Actions"
    },
    buttons: {
      complete: propLabels?.buttons?.complete || componentLabels?.reflectionDetail?.buttons?.complete || "Complete",
      edit: propLabels?.buttons?.edit || componentLabels?.reflectionDetail?.buttons?.edit || "Edit",
      delete: propLabels?.buttons?.delete || componentLabels?.reflectionDetail?.buttons?.delete || "Delete",
      close: propLabels?.buttons?.close || componentLabels?.reflectionDetail?.buttons?.close || "Close",
      retry: propLabels?.buttons?.retry || componentLabels?.reflectionDetail?.buttons?.retry || "Retry"
    },
    fields: {
      mood: propLabels?.fields?.mood || componentLabels?.reflectionDetail?.fields?.mood || "Mood",
      tags: propLabels?.fields?.tags || componentLabels?.reflectionDetail?.fields?.tags || "Tags",
      createdAt: propLabels?.fields?.createdAt || componentLabels?.reflectionDetail?.fields?.createdAt || "Created At",
      completedAt: propLabels?.fields?.completedAt || componentLabels?.reflectionDetail?.fields?.completedAt || "Completed At",
      content: propLabels?.fields?.content || componentLabels?.reflectionDetail?.fields?.content || "Reflection",
      action: propLabels?.fields?.action || componentLabels?.reflectionDetail?.fields?.action || "Action"
    },
    errors: {
      loadFailed: propLabels?.errors?.loadFailed || componentLabels?.reflectionDetail?.errors?.loadFailed || "Failed to load reflection",
      completeFailed: propLabels?.errors?.completeFailed || componentLabels?.reflectionDetail?.errors?.completeFailed || "Failed to complete reflection",
      notFound: propLabels?.errors?.notFound || componentLabels?.reflectionDetail?.errors?.notFound || "Reflection not found"
    }
  };

  // 加载反思数据
  const loadReflectionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取反思数据
      const reflectionData = await getReflection(reflectionId);
      if (reflectionData) {
        setReflection(reflectionData);
      } else {
        setError(labels.errors.notFound);
      }
    } catch (err) {
      console.error('Failed to load reflection data:', err);
      setError(labels.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen && reflectionId) {
      loadReflectionData();
    }
  }, [isOpen, reflectionId]);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', loadReflectionData);

  // 处理完成反思
  const handleCompleteReflection = async () => {
    if (!reflection || !reflection.id) return;

    try {
      setIsCompleting(true);
      setError(null);

      // 完成反思
      await completeReflection(reflection.id, reflection.action || '');

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 刷新反思数据
      await loadReflectionData();

      // 通知父组件
      if (onReflectionCompleted && reflection) {
        onReflectionCompleted(reflection);
      }

      // 通知反思更新
      if (onReflectionUpdated) {
        onReflectionUpdated();
      }
    } catch (err) {
      console.error('Failed to complete reflection:', err);
      setError(labels.errors.completeFailed);
    } finally {
      setIsCompleting(false);
    }
  };

  // 处理编辑反思
  const handleEditReflection = () => {
    setIsEditing(true);
  };

  // 处理反思更新
  const handleReflectionFormSubmit = async (updatedReflection: Partial<ReflectionRecord>) => {
    if (!reflection || !reflection.id) return;

    try {
      // 更新反思
      await updateReflection(reflection.id, updatedReflection);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.3);

      // 刷新反思数据
      await loadReflectionData();

      // 退出编辑模式
      setIsEditing(false);

      // 通知反思更新
      if (onReflectionUpdated) {
        onReflectionUpdated();
      }
    } catch (err) {
      console.error('Failed to update reflection:', err);
    }
  };

  // 渲染反思详情
  const renderReflectionDetails = () => {
    if (!reflection) return null;

    return (
      <div className="reflection-details">
        <div className="reflection-info grid grid-cols-2 gap-4 mb-4">
          {reflection.mood && (
            <div className="reflection-mood">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.mood}</h4>
              <p>{reflection.mood}</p>
            </div>
          )}
          {reflection.tags && reflection.tags.length > 0 && (
            <div className="reflection-tags">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.tags}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {reflection.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="reflection-created-at">
            <h4 className="text-sm font-bold text-gray-600">{labels.fields.createdAt}</h4>
            <p>{formatDate(reflection.createdAt)}</p>
          </div>
          {reflection.completedAt && (
            <div className="reflection-completed-at">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.completedAt}</h4>
              <p>{formatDate(reflection.completedAt)}</p>
            </div>
          )}
        </div>

        {reflection.content && (
          <div className="reflection-content mb-4">
            <h4 className="text-sm font-bold text-gray-600 mb-1">{labels.fields.content}</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{reflection.content}</p>
          </div>
        )}

        <div className="reflection-actions flex justify-end gap-2 mt-4">
          {reflection.status !== ReflectionStatus.COMPLETED && (
            <Button
              variant="jade"
              onClick={handleCompleteReflection}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                labels.buttons.complete
              )}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleEditReflection}
          >
            {labels.buttons.edit}
          </Button>
        </div>
      </div>
    );
  };

  // 渲染行动
  const renderActions = () => {
    if (!reflection || !reflection.id) return null;

    return (
      <div className="reflection-actions-tab">
        {reflection.action ? (
          <div className="reflection-action mb-4">
            <h4 className="text-sm font-bold text-gray-600 mb-1">{labels.fields.action}</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{reflection.action}</p>
          </div>
        ) : (
          <div className="no-action text-center p-4">
            <p className="text-gray-500">No action has been set for this reflection</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <TraditionalWindowModal
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      closeOnOutsideClick={!isCompleting && !isEditing}
      closeOnEsc={!isCompleting && !isEditing}
      showCloseButton={!isCompleting && !isEditing}
      size="large"
    >
      <EnhancedDataLoader
        isLoading={isLoading}
        isError={!!error}
        error={error}
        data={reflection}
        onRetry={loadReflectionData}
        skeletonVariant="jade"
        skeletonLayout="list"
        skeletonCount={4}
      >
        {(reflection) => (
          <div className="enhanced-reflection-detail p-4">
            {isEditing ? (
              <EnhancedReflectionForm
                initialReflection={reflection}
                onSubmit={handleReflectionFormSubmit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <OptimizedAnimatedContainer priority="high">
                <h2 className="text-xl font-bold mb-4">{reflection.title || "Reflection"}</h2>

                {/* 选项卡 */}
                <div className="tabs-container mb-4">
                  <div className="tabs flex border-b border-gray-200">
                    <button
                      className={`tab-button py-2 px-4 ${
                        activeTab === 'details' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('details')}
                    >
                      {labels.tabs.details}
                    </button>
                    <button
                      className={`tab-button py-2 px-4 ${
                        activeTab === 'actions' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('actions')}
                    >
                      {labels.tabs.actions}
                    </button>
                  </div>
                </div>

                {/* 选项卡内容 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'details' && renderReflectionDetails()}
                    {activeTab === 'actions' && renderActions()}
                  </motion.div>
                </AnimatePresence>
              </OptimizedAnimatedContainer>
            )}
          </div>
        )}
      </EnhancedDataLoader>
    </TraditionalWindowModal>
  );
};

export default EnhancedReflectionDetailDialog;

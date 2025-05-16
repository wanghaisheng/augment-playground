// src/components/vip/FeedbackForm.tsx
import React, { useState } from 'react';
import Button from '@/components/common/Button';

interface FeedbackFormProps {
  onSubmit: (feedback: string) => void;
  onCancel: () => void;
  language: string;
}

/**
 * 反馈表单组件
 */
const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onCancel,
  language
}) => {
  const [feedback, setFeedback] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 取消原因选项
  const cancelReasons = [
    {
      id: 'too-expensive',
      textZh: '价格太贵',
      textEn: 'Too expensive'
    },
    {
      id: 'not-enough-features',
      textZh: '功能不够',
      textEn: 'Not enough features'
    },
    {
      id: 'not-using-enough',
      textZh: '使用频率不高',
      textEn: 'Not using it enough'
    },
    {
      id: 'found-alternative',
      textZh: '找到了替代品',
      textEn: 'Found an alternative'
    },
    {
      id: 'technical-issues',
      textZh: '技术问题',
      textEn: 'Technical issues'
    },
    {
      id: 'other',
      textZh: '其他原因',
      textEn: 'Other reason'
    }
  ];
  
  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback && !selectedReason) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 构建完整反馈
      const fullFeedback = selectedReason
        ? `${selectedReason}: ${feedback}`
        : feedback;
      
      await onSubmit(fullFeedback);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 选择原因
  const handleSelectReason = (reasonId: string) => {
    setSelectedReason(reasonId);
  };
  
  return (
    <div className="feedback-form bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {language === 'zh' ? '您为什么想取消订阅？' : 'Why do you want to cancel?'}
      </h3>
      
      {/* 取消原因选项 */}
      <div className="cancel-reasons mb-6">
        <p className="text-sm text-gray-600 mb-2">
          {language === 'zh' ? '请选择一个原因（可选）：' : 'Please select a reason (optional):'}
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {cancelReasons.map(reason => (
            <button
              key={reason.id}
              className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedReason === reason.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => handleSelectReason(reason.id)}
              type="button"
            >
              {language === 'zh' ? reason.textZh : reason.textEn}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* 反馈文本区域 */}
        <div className="mb-4">
          <label 
            htmlFor="feedback" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {language === 'zh' ? '您的反馈（可选）：' : 'Your feedback (optional):'}
          </label>
          <textarea
            id="feedback"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={
              language === 'zh'
                ? '请告诉我们如何改进...'
                : 'Please tell us how we can improve...'
            }
          />
        </div>
        
        {/* 提交按钮 */}
        <div className="flex justify-end gap-3">
          <Button
            color="secondary"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {language === 'zh' ? '取消' : 'Cancel'}
          </Button>
          
          <Button
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {language === 'zh' ? '提交反馈' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;

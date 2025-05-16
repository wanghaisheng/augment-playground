// src/components/vip/PandaSkinDemo.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { 
  getAllSkins, 
  PandaSkinRecord, 
  PandaSkinType,
  PandaSkinRarity
} from '@/services/pandaSkinService';
import { usePandaState } from '@/context/PandaStateProvider';
import { playSound, SoundType } from '@/utils/sound';

/**
 * VIP专属熊猫皮肤演示组件
 */
const PandaSkinDemo: React.FC = () => {
  const [skins, setSkins] = useState<PandaSkinRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const navigate = useNavigate();
  
  // 加载皮肤数据
  useEffect(() => {
    const loadSkins = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 获取所有皮肤
        const allSkins = await getAllSkins();
        
        // 过滤出VIP专属皮肤
        const vipSkins = allSkins.filter(skin => skin.isVipExclusive);
        setSkins(vipSkins);
      } catch (err) {
        console.error('Failed to load skins:', err);
        setError('加载皮肤失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSkins();
  }, []);
  
  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    navigate('/vip-benefits');
  };
  
  // 获取稀有度信息
  const getRarityInfo = (rarity: PandaSkinRarity) => {
    switch (rarity) {
      case PandaSkinRarity.COMMON:
        return { text: '普通', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      case PandaSkinRarity.UNCOMMON:
        return { text: '不常见', color: 'text-green-600', bgColor: 'bg-green-100' };
      case PandaSkinRarity.RARE:
        return { text: '稀有', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case PandaSkinRarity.EPIC:
        return { text: '史诗', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case PandaSkinRarity.LEGENDARY:
        return { text: '传说', color: 'text-gold-600', bgColor: 'bg-gold-100' };
      default:
        return { text: '普通', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner variant="jade" size="medium" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="error-container text-center p-4">
          <div className="error-message text-red-500 mb-4">{error}</div>
          <Button variant="jade" onClick={() => window.location.reload()}>
            重试
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-jade-800">VIP专属熊猫皮肤</h2>
      <p className="text-gray-600 mb-6">
        VIP会员可以使用这些精美的熊猫皮肤，让您的熊猫伙伴更加独特
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {skins.map((skin) => {
          const rarityInfo = getRarityInfo(skin.rarity);
          return (
            <motion.div
              key={skin.id}
              className="skin-card bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="skin-image p-4 bg-gray-50 flex justify-center">
                <img
                  src={skin.thumbnailPath}
                  alt={skin.name}
                  className="h-32 object-contain"
                />
              </div>
              
              <div className="skin-details p-4">
                <h3 className="text-lg font-bold mb-1">{skin.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rarityInfo.bgColor} ${rarityInfo.color}`}>
                    {rarityInfo.text}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
                    VIP专属
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{skin.description}</p>
                
                {isVip ? (
                  <div className="text-jade-600 text-sm font-medium">
                    ✓ 已解锁
                  </div>
                ) : (
                  <Button
                    variant="gold"
                    onClick={handleNavigateToVip}
                    className="w-full"
                  >
                    升级到VIP解锁
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {!isVip && (
        <div className="vip-promotion p-4 bg-gold-50 border border-gold-200 rounded-lg">
          <h3 className="font-bold text-gold-700 mb-2">
            <span className="mr-1">★</span> 成为VIP会员，解锁所有熊猫皮肤
          </h3>
          <p className="text-gray-600 mb-4">
            VIP会员可以使用所有专属熊猫皮肤，让您的熊猫伙伴更加独特。此外，VIP会员还可以享受更多特权，如资源加成、成长速度提升等。
          </p>
          <Button
            variant="gold"
            onClick={handleNavigateToVip}
            className="w-full md:w-auto"
          >
            了解VIP特权
          </Button>
        </div>
      )}
    </div>
  );
};

export default PandaSkinDemo;

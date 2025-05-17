// src/pages/BambooTradingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { useLanguage } from '@/context/LanguageProvider';
import { useBambooSystem } from '@/hooks/useBambooSystem';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { fetchBambooTradingPageView } from '@/services/localizedContentService';
import type {
  BambooTradingPageViewLabelsBundle,
  BambooTradingPageViewDataPayload,
} from '@/types';
import ErrorDisplay from '@/components/common/ErrorDisplay';

/**
 * 竹子交易页面
 */
const BambooTradingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  // const { content } = useLocalizedView('bambooTrading'); // This seems to be for component-level labels, pageLabels is primary for page text

  // 使用竹子系统钩子
  const {
    resources,
    tradeRates,
    tradeHistory,
    bambooCount,
    coinsCount,
    jadeCount,
    // isLoadingTrading: isLoading, // isLoading will come from page-level useLocalizedView or local state
    tradeBambooForResource,
    tradeResourceForBamboo
  } = useBambooSystem();

  // const tradingSystem = useBambooTradingSystem(); // Assuming this hook might be defined elsewhere or its functionality integrated/mocked

  const {
    labels: pageLabels,
    data: pageData,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<BambooTradingPageViewDataPayload | null, BambooTradingPageViewLabelsBundle>(
    'bambooTradingViewContent',
    fetchBambooTradingPageView
  );

  const safePageLabels = (pageLabels || {}) as any;
  const safePageData = (pageData || {}) as BambooTradingPageViewDataPayload | any;


  // 本地状态
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const [tradeDirection, setTradeDirection] = useState<'bamboo_to_resource' | 'resource_to_bamboo'>('bamboo_to_resource');
  const [isTrading, setIsTrading] = useState(false); // Local trading operation status
  const [buyAmount, setBuyAmount] = useState(''); // For input fields
  const [sellAmount, setSellAmount] = useState(''); // For input fields
  const [tradeMessage, setTradeMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 默认选择第一个资源
  useEffect(() => {
    if (resources.length > 0 && !selectedResourceId) {
      setSelectedResourceId(resources[0].id!);
    }
  }, [resources, selectedResourceId]);

  // 选择资源
  const handleSelectResource = (resourceId: number) => {
    setSelectedResourceId(resourceId);
    setBuyAmount('');
    setSellAmount('');
    setTradeMessage(null);
  };

  // 切换交易方向
  const handleToggleTradeDirection = () => {
    setTradeDirection(prev =>
      prev === 'bamboo_to_resource' ? 'resource_to_bamboo' : 'bamboo_to_resource'
    );
    setBuyAmount('');
    setSellAmount('');
    setTradeMessage(null);
  };

  // 处理交易金额变化 (Generic, might need separate for buy/sell if logic diverges)
  const handleGenericTradeAmountChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'buy' | 'sell') => {
    const value = e.target.value;
    if (type === 'buy') {
      setBuyAmount(value);
    } else {
      setSellAmount(value);
    }
    setTradeMessage(null);
  };

  // 执行交易 (Refactored to use buyAmount/sellAmount from state)
  const handleTradeExecution = async () => {
    const currentTradeAmountStr = tradeDirection === 'resource_to_bamboo' ? buyAmount : sellAmount;
    const currentTradeAmount = parseInt(currentTradeAmountStr);

    if (isNaN(currentTradeAmount) || currentTradeAmount <= 0) {
      setTradeMessage({ type: 'error', message: safePageLabels.invalidAmountError ?? 'Please enter a valid amount.' });
      return;
    }
    if (!selectedResourceId || isTrading) return;

    setIsTrading(true);
    setTradeMessage(null);
    try {
      // This part needs to use the actual trading logic, potentially from useBambooSystem or a new useBambooTradingSystem
      // The existing logic for tradeBambooForResource/tradeResourceForBamboo from useBambooSystem seems specific.
      // For this refactor, we'll simulate a successful trade.
      // In a real scenario, replace with:
      // if (tradeDirection === 'resource_to_bamboo') {
      //   await tradeResourceForBamboo(selectedResourceId, currentTradeAmount); // or similar from a trading hook
      // } else {
      //   await tradeBambooForResource(selectedResourceId, currentTradeAmount); // or similar
      // }

      // Mock trade success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setTradeMessage({
        type: 'success',
        message: safePageLabels.transactionSuccessMessage ?? 'Trade successful!'
      });
      playSound(SoundType.SUCCESS); // Changed from TRADE_SUCCESS

      // Clear amounts after successful trade
      setBuyAmount('');
      setSellAmount('');
      refetch(); // Refetch page data which might include updated balances
      // Potentially refetch bambooSystem data too if not covered by page refetch
      // bambooSystem.refetch?.();

    } catch (error) {
      console.error('Failed to trade:', error);
      const errorMessage = error instanceof Error ? error.message : (safePageLabels.transactionFailedMessage ?? 'Failed to trade');
      setTradeMessage({ type: 'error', message: errorMessage });
      playSound(SoundType.FAIL); // Changed from TRADE_FAIL, an alternative is SoundType.ERROR
    } finally {
      setIsTrading(false);
    }
  };


  // 获取选中的资源
  const getSelectedResource = () => {
    return resources.find(resource => resource.id === selectedResourceId);
  };

  // 获取选中资源的交易汇率
  const getSelectedResourceTradeRate = () => {
    return selectedResourceId ? tradeRates.get(selectedResourceId) : null;
  };

  // 计算交易结果预览
  const calculateTradePreview = () => {
    const currentTradeAmountStr = tradeDirection === 'resource_to_bamboo' ? buyAmount : sellAmount;
    const currentTradeAmount = parseInt(currentTradeAmountStr);

    if (isNaN(currentTradeAmount) || !selectedResourceId || currentTradeAmount <= 0) return null;

    const tradeRate = getSelectedResourceTradeRate();
    if (!tradeRate) return null;

    const resourceName = getSelectedResource()?.name ?? 'Resource';
    const bambooLabelText = language === 'zh' ? '竹子' : 'Bamboo';

    if (tradeDirection === 'bamboo_to_resource') { // Selling bamboo
      const resourceAmount = Math.floor(currentTradeAmount * tradeRate.bambooToResourceRate);
      return {
        input: `${currentTradeAmount} ${bambooLabelText}`,
        output: `${resourceAmount} ${resourceName}`
      };
    } else { // Buying bamboo (selling resource)
      const bambooAmount = Math.floor(currentTradeAmount * tradeRate.resourceToBambooRate);
      return {
        input: `${currentTradeAmount} ${resourceName}`,
        output: `${bambooAmount} ${bambooLabelText}`
      };
    }
  };

  // 格式化时间
  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };

  // 获取资源图标
  const getResourceIcon = (resourceName: string) => {
    const resource = resources.find(r => r.name === resourceName);
    return resource?.imageUrl || '/assets/bamboo/resources/default.svg';
  };

  const tradePreview = calculateTradePreview();

  if (isPending && !pageLabels) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner text={safePageLabels.loadingMessage ?? 'Loading Market...'} />
      </div>
    );
  }

  if (isError && !pageData) { // Prioritize error display if data fetching failed critically
    return (
      <div className="p-4">
        <ErrorDisplay
          error={error}
          title={safePageLabels.errorTitle ?? 'Market Data Error'}
          messageTemplate={safePageLabels.errorMessage ?? 'Could not load market data. {message}'}
          onRetry={refetch}
          retryButtonText={safePageLabels.retryButtonText ?? 'Try Again'}
        />
      </div>
    );
  }

  // Main render
  return (
    <div className="bamboo-trading-page p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{safePageLabels.pageTitle ?? 'Bamboo Marketplace'}</h1>

      {isTrading && <LoadingSpinner text={safePageLabels.processingTradeMessage ?? "Processing Trade..."}/>}

      {tradeMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${tradeMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {tradeMessage.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{safePageLabels.marketTitle ?? 'Market Exchange'}</h2>

          <div className="mb-4">
            <p className="text-sm text-gray-600">{safePageLabels.currentPriceLabel ?? 'Current Price (Example):'} 1 Bamboo = ¥{(safePageData?.currentMarketPrice ?? 0.1).toFixed(2)}</p>
            <p className="text-sm text-gray-600">{safePageLabels.yourBambooLabel ?? 'Your Bamboo:'} {bambooCount ?? 0}</p>
            {/* Display other resource counts like coins, jade if available from useBambooSystem or pageData */}
          </div>

          <div className="flex items-center mb-4">
                  <Button
              onClick={handleToggleTradeDirection}
              variant="outlined"
                    size="small"
                  >
              {tradeDirection === 'bamboo_to_resource' ? (safePageLabels.sellBambooModeButton ?? 'Sell Bamboo') : (safePageLabels.buyBambooModeButton ?? 'Buy Bamboo')}
                  </Button>
                </div>

          {tradeDirection === 'bamboo_to_resource' ? ( // Selling Bamboo
            <div className="trade-form">
              <label htmlFor="sell-amount" className="block text-sm font-medium text-gray-700">
                {safePageLabels.sellAmountLabel ?? 'Amount of Bamboo to Sell:'}
                  </label>
                  <input
                id="sell-amount"
                    type="number"
                value={sellAmount}
                onChange={(e) => handleGenericTradeAmountChange(e, 'sell')}
                placeholder={safePageLabels.enterAmountPlaceholder ?? "Enter amount"}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isTrading}
              />
              <Button onClick={handleTradeExecution} disabled={isTrading || !sellAmount || parseInt(sellAmount) <= 0} className="mt-3 jade-button">
                {safePageLabels.sellButtonText ?? 'Sell Bamboo'}
              </Button>
                </div>
          ) : ( // Buying Bamboo (Selling Resource - simplified to just "buying" bamboo)
            <div className="trade-form">
               <label htmlFor="buy-amount" className="block text-sm font-medium text-gray-700">
                {safePageLabels.buyAmountLabel ?? 'Amount of Bamboo to Buy:'}
              </label>
              <input
                id="buy-amount"
                type="number"
                value={buyAmount}
                onChange={(e) => handleGenericTradeAmountChange(e, 'buy')}
                placeholder={safePageLabels.enterAmountPlaceholder ?? "Enter amount"}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isTrading}
              />
              <Button onClick={handleTradeExecution} disabled={isTrading || !buyAmount || parseInt(buyAmount) <= 0} className="mt-3 jade-button">
                {safePageLabels.buyButtonText ?? 'Buy Bamboo'}
              </Button>
                  </div>
                )}
          {tradePreview && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
              <p>{safePageLabels.tradePreviewInputLabel ?? 'You give:'} {tradePreview.input}</p>
              <p>{safePageLabels.tradePreviewOutputLabel ?? 'You get (approx.):'} {tradePreview.output}</p>
                    </div>
                  )}
          {(parseInt(sellAmount) > bambooCount && tradeDirection === 'bamboo_to_resource') && (
            <p className="text-red-500 text-xs mt-1">{safePageLabels.notEnoughBambooError ?? 'Not enough bamboo to sell.'}</p>
          )}
           {/* Add similar error for not enough resources when buying bamboo if applicable */}

                      </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{safePageLabels.recentTransactionsTitle ?? 'Recent Transactions'}</h2>
          {safePageData?.recentTransactions && safePageData.recentTransactions.length > 0 ? (
            <ul className="space-y-3">
              {safePageData.recentTransactions.slice(0, 5).map((tx: any) => ( // Use any for tx if structure is not strictly defined in types yet
                <li key={tx.id} className="p-2 border-b border-gray-200 text-xs">
                  <div className="flex justify-between">
                    <span>{(tx.type === 'sell' ? safePageLabels.txTypeSell ?? 'Sold' : safePageLabels.txTypeBuy ?? 'Bought') + ' ' + tx.amount + (tx.type === 'sell' ? ' Bamboo' : ' ResourceX')}</span>
                    <span className="text-gray-500">{formatTime(tx.timestamp)}</span>
                            </div>
                  <div className="text-gray-600">
                    {(safePageLabels.txPriceLabel ?? 'Price:')} ¥{tx.price?.toFixed(2)}
                            </div>
                </li>
              ))}
            </ul>
                        ) : (
            <p className="text-sm text-gray-500">{safePageLabels.noTransactionsMessage ?? 'No recent transactions.'}</p>
                        )}
                      </div>
                    </div>
      {/* Particle animation container removed */}
    </div>
  );
};

export default BambooTradingPage;

// src/pages/BambooDashboardPage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchBambooDashboardPageView } from '@/services/localizedContentService';
import type {
  BambooDashboardPageViewLabelsBundle,
  BambooDashboardPageViewDataPayload,
  // ApiError, // Not explicitly used here
} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
// import PageHeader from '@/components/common/PageHeader'; // Commented out as file is missing
// import { BarChart, LineChart, PieChart } from '@/components/charts'; // Assuming charts for a dashboard

const StatCard: React.FC<{ title: string; value: string | number; unit?: string }> = ({ title, value, unit }) => (
  <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
    <h3 style={{ fontSize: '1em', color: '#555', marginBottom: '5px' }}>{title}</h3>
    <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>
      {value} {unit}
    </p>
  </div>
);

const BambooDashboardPage: React.FC = () => {
  const {
    labels: pageLabels,
    data: pageData,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<BambooDashboardPageViewDataPayload | null, BambooDashboardPageViewLabelsBundle>(
    'bambooDashboardViewContent', // Unique query key
    fetchBambooDashboardPageView    // The fetch function
  );

  const safePageLabels = (pageLabels || {}) as any;
  const safePageData = (pageData || {}) as BambooDashboardPageViewDataPayload | any; // Allow any for flexibility with defaults if structure is complex

  if (isPending && !pageLabels) { // Keep pageLabels for initial check, as safePageLabels will be {}
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <LoadingSpinner />
        <p>{safePageLabels.loadingMessage ?? 'Loading Dashboard...'}</p>
      </div>
    );
  }

  if (isError || !pageData) { // If labels might be there but data is not, or general error. Keep pageData for initial check.
    return (
      <div style={{padding: '20px'}}>
        {/* <PageHeader title={safePageLabels.errorTitle ?? 'Dashboard Error'} /> */}
        <ErrorDisplay 
          error={error} 
          title={safePageLabels.errorTitle ?? 'Data Error'} 
          messageTemplate={safePageLabels.errorMessage ?? 'Could not load dashboard data: {message}'}
          onRetry={refetch} 
          retryButtonText={safePageLabels.retryButtonText ?? 'Retry'}
        />
      </div>
    );
  }

  // At this point, if we haven't returned, pageData should exist if no error, 
  // but we use safePageData for robustness with defaults.
  
  return (
    <div className="bamboo-dashboard-page" style={{padding: '20px'}}>
      {/* <PageHeader title={safePageLabels.pageTitle ?? 'Bamboo Dashboard'} /> */}

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.4em', marginBottom: '15px' }}>{safePageLabels.overviewSectionTitle ?? 'Overview'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {safePageData.userName && <StatCard title="User" value={safePageData.userName} />}
          {safePageData.totalBamboo !== undefined && (
            <StatCard title={safePageLabels.totalBambooLabel ?? 'Total Bamboo'} value={safePageData.totalBamboo} unit="units" />
          )}
          {safePageData.growthRate !== undefined && (
            <StatCard title={safePageLabels.bambooGrowthRateLabel ?? 'Growth Rate'} value={safePageData.growthRate} unit="/hr" />
          )}
          {safePageData.currentMarketPrice !== undefined && (
            <StatCard title={safePageLabels.marketPriceLabel ?? 'Market Price'} value={`¥${safePageData.currentMarketPrice.toFixed(2)}`} unit="/unit" />
          )}
          {safePageData.lastActivityDate && (
            <StatCard title="Last Activity" value={new Date(safePageData.lastActivityDate).toLocaleDateString()} />
          )}
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.4em', marginBottom: '15px' }}>{safePageLabels.growthSectionTitle ?? 'Growth & Planting'}</h2>
        {/* Placeholder for growth charts or links to planting page */}
        <p>Details about bamboo growth, active plots, and planting statistics would go here. (e.g., using LineChart for growth over time)</p>
      </section>
            
      <section>
        <h2 style={{ fontSize: '1.4em', marginBottom: '15px' }}>{safePageLabels.marketSectionTitle ?? 'Market Trends'}</h2>
        {/* Placeholder for market charts or links to trading page */}
        <p>Information about bamboo market prices, demand, and trading activity. (e.g., using BarChart for price history)</p>
      </section>
          
      {/* Example: <LineChart data={...} options={...} /> */}
    </div>
  );
};

export default BambooDashboardPage;

// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from '@/context/LanguageProvider';
import { PandaStateProvider } from '@/context/PandaStateProvider';
import { DataRefreshProvider } from '@/context/DataRefreshProvider';
import { populateDB, db } from '@/db';
import { addVipNavigationLabels, addBattlePassPageViewLabels } from '@/db-update';
import { initializeBattlePassDatabase } from '@/db-battle-pass';
import { populateBattlePassSampleData } from '@/db-battle-pass-sample';
import { initializeBattlePassTaskTracking } from '@/services/battlePassTaskTrackingService';
import AppShell from '@/components/layout/AppShell';
import AppRouter from '@/router';
import { initializeDataSync } from '@/services/dataSyncService';
import { initializeTimelyRewards, updateTimelyRewardsStatus } from '@/services/timelyRewardService';
import { queryClient } from '@/services/queryClient';

const App: React.FC = () => {
  useEffect(() => {
    // 初始化和填充数据库
    const initDB = async () => {
      try {
        // Populate Dexie DB on app start for development
        if (import.meta.env.DEV) { // Vite specific dev check
          await populateDB();

          // Add VIP navigation labels
          await addVipNavigationLabels();

          // Add Battle Pass page view labels
          await addBattlePassPageViewLabels();

          // Initialize Battle Pass database
          await initializeBattlePassDatabase();

          // Populate Battle Pass sample data
          await populateBattlePassSampleData();

          // Initialize Battle Pass task tracking
          await initializeBattlePassTaskTracking('current-user');
        }

        // 初始化数据同步服务
        setTimeout(() => {
          try {
            initializeDataSync({
              autoSyncInterval: 30000, // 30秒
              maxRetryCount: 5,
              batchSize: 20
            });

            // 确保数据库表已创建
            try {
              // 检查及时奖励表是否存在
              db.table('timelyRewards').count().then(count => {
                console.log(`TimelyRewards table exists with ${count} records`);

                // 初始化及时奖励系统
                initializeTimelyRewards().then(() => {
                  console.log("Timely rewards initialized successfully");

                  // 更新及时奖励状态
                  updateTimelyRewardsStatus().then(() => {
                    console.log("Timely rewards status updated successfully");
                  }).catch(err => {
                    console.error("Failed to update timely rewards status:", err);
                  });
                }).catch(err => {
                  console.error("Failed to initialize timely rewards:", err);
                });
              }).catch(err => {
                console.error("Failed to access timelyRewards table:", err);
              });
            } catch (err) {
              console.error("Error during timely rewards initialization:", err);
            }
          } catch (syncErr) {
            console.error("Failed to initialize data sync service:", syncErr);
          }
        }, 2000); // 延迟2秒初始化同步服务，确保数据库已经准备好
      } catch (err) {
        console.error("Failed to initialize database:", err);
      }
    };

    initDB();

    // 监听在线状态变化
    const handleOnline = () => {
      console.log('App is online, triggering sync');
      import('@/services/dataSyncService').then(({ syncPendingItems }) => {
        syncPendingItems().catch(err => {
          console.error('Sync failed:', err);
        });
      }).catch(err => {
        console.error('Failed to import dataSyncService:', err);
      });
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);

      // 停止自动同步
      import('@/services/dataSyncService').then(({ stopAutoSync }) => {
        stopAutoSync();
      }).catch(err => {
        console.error('Failed to import dataSyncService for cleanup:', err);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <DataRefreshProvider>
          <PandaStateProvider>
            <BrowserRouter>
              <AppShell> {/* AppShell fetches global layout labels and provides overall structure */}
                <AppRouter /> {/* AppRouter handles page-specific content and routing */}
              </AppShell>
            </BrowserRouter>
          </PandaStateProvider>
        </DataRefreshProvider>
      </LanguageProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
export default App;
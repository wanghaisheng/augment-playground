// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from '@/context/LanguageProvider';
import { PandaStateProvider } from '@/context/PandaStateProvider';
import { DataRefreshProvider } from '@/context/DataRefreshProvider';
import { SkeletonProvider } from '@/context/SkeletonProvider';
import { AnimationPerformanceProvider } from '@/context/AnimationPerformanceProvider';
import { BackgroundMusicProvider } from '@/context/BackgroundMusicProvider';
import { NotificationProvider } from '@/context/NotificationProvider';
import { OfflineStatusProvider } from '@/context/OfflineStatusProvider';
import { populateDB, db } from '@/db-old';
import { addVipNavigationLabels, addBattlePassPageViewLabels, addGrowthBoostIndicatorLabels } from '@/db-update';
import { addPandaEvolutionLabels } from '@/db-panda-evolution';
import { initializeBattlePassDatabase } from '@/db-battle-pass';
import { populateBattlePassSampleData } from '@/db-battle-pass-sample';
import { initializeBattlePassTaskTracking } from '@/services/battlePassTaskTrackingService';
import AppShell from '@/components/layout/AppShell';
import AppRouter from '@/router';
import PandaEvolutionManager from '@/components/game/PandaEvolutionManager';
import HighlightMomentManager from '@/components/vip/HighlightMomentManager';
import PainPointManager from '@/components/vip/PainPointManager';
import ResourceShortageManager from '@/components/vip/ResourceShortageManager';
import VipTrialManager from '@/components/vip/VipTrialManager';
import SubscriptionManager from '@/components/vip/SubscriptionManager';
import SoundManager from '@/components/sound/SoundManager';
import NotificationManager from '@/components/notification/NotificationManager';
import { initializeSyncServices, applyUserSyncPreferences } from '@/services/syncInitializer';
import { initializeTimelyRewards, updateTimelyRewardsStatus } from '@/services/timelyRewardService';
import { initializeResourceMultipliers } from '@/services/resourceMultiplierService';
import { initializeGrowthBoosts } from '@/services/growthBoostService';
import { initializeUserTitles } from '@/services/userTitleService';
import { initializePainPointSolutions } from '@/services/painPointService';
import { initializePandaSkins } from '@/services/pandaSkinService';
import { initializeVipTaskSeries } from '@/services/vipTaskService';
import { initializeMeditationCourses } from '@/services/meditationInitService';
import { initializeBambooPlanting } from '@/services/bambooPlantingService';
import { initializeBambooTrading } from '@/services/bambooTradingService';
import { initializeOfflineSupport } from '@/services/offlineService';
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

          // Add Growth Boost Indicator labels
          await addGrowthBoostIndicatorLabels();

          // Add Panda Evolution labels
          await addPandaEvolutionLabels();

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
            // 初始化同步服务
            initializeSyncServices();

            // 应用用户同步偏好
            applyUserSyncPreferences();

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

                // 初始化资源加倍系统
                initializeResourceMultipliers().then(() => {
                  console.log("Resource multipliers initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize resource multipliers:", err);
                });

                // 初始化成长速度加成系统
                initializeGrowthBoosts().then(() => {
                  console.log("Growth boosts initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize growth boosts:", err);
                });

                // 初始化用户称号系统
                initializeUserTitles().then(() => {
                  console.log("User titles initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize user titles:", err);
                });

                // 初始化痛点解决方案系统
                initializePainPointSolutions().then(() => {
                  console.log("Pain point solutions initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize pain point solutions:", err);
                });

                // 初始化熊猫皮肤系统
                initializePandaSkins().then(() => {
                  console.log("Panda skins initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize panda skins:", err);
                });

                // 初始化VIP任务系列
                initializeVipTaskSeries().then(() => {
                  console.log("VIP task series initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize VIP task series:", err);
                });

                // 初始化冥想课程
                initializeMeditationCourses().then(() => {
                  console.log("Meditation courses initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize meditation courses:", err);
                });

                // 初始化竹子种植系统
                initializeBambooPlanting().then(() => {
                  console.log("Bamboo planting system initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize bamboo planting system:", err);
                });

                // 初始化竹子交易系统
                initializeBambooTrading().then(() => {
                  console.log("Bamboo trading system initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize bamboo trading system:", err);
                });

                // 初始化离线支持
                initializeOfflineSupport().then(() => {
                  console.log("Offline support initialized successfully");
                }).catch(err => {
                  console.error("Failed to initialize offline support:", err);
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
      // 使用优化的同步服务
      import('@/services/optimizedSyncService').then(({ syncPendingItems }) => {
        syncPendingItems().catch(err => {
          console.error('Optimized sync failed:', err);
        });
      }).catch(err => {
        console.error('Failed to import optimizedSyncService:', err);
        // 回退到传统同步服务
        import('@/services/dataSyncService').then(({ syncPendingItems }) => {
          syncPendingItems().catch(err => {
            console.error('Traditional sync failed:', err);
          });
        }).catch(err => {
          console.error('Failed to import dataSyncService:', err);
        });
      });
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);

      // 停止自动同步
      import('@/services/optimizedSyncService').then(({ stopAutoSync }) => {
        stopAutoSync();
      }).catch(err => {
        console.error('Failed to import optimizedSyncService for cleanup:', err);
        // 回退到传统同步服务
        import('@/services/dataSyncService').then(({ stopAutoSync }) => {
          stopAutoSync();
        }).catch(err => {
          console.error('Failed to import dataSyncService for cleanup:', err);
        });
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <DataRefreshProvider>
          <PandaStateProvider>
            <AnimationPerformanceProvider>
              <BackgroundMusicProvider>
                <NotificationProvider>
                  <OfflineStatusProvider>
                    <SkeletonProvider>
                    <BrowserRouter>
                      <AppShell> {/* AppShell fetches global layout labels and provides overall structure */}
                        <AppRouter /> {/* AppRouter handles page-specific content and routing */}
                        <PandaEvolutionManager /> {/* Manages panda evolution animations */}
                        <HighlightMomentManager /> {/* Manages high-light moment VIP promotions */}
                        <PainPointManager /> {/* Manages pain point solution prompts */}
                        <ResourceShortageManager /> {/* Manages resource shortage prompts */}
                        <VipTrialManager /> {/* Manages VIP trial experience */}
                        <SubscriptionManager /> {/* Manages subscription expiration reminders */}
                        <SoundManager /> {/* Manages sound effects and background music */}
                        <NotificationManager /> {/* Manages notifications */}
                      </AppShell>
                    </BrowserRouter>
                  </SkeletonProvider>
                  </OfflineStatusProvider>
                </NotificationProvider>
              </BackgroundMusicProvider>
            </AnimationPerformanceProvider>
          </PandaStateProvider>
        </DataRefreshProvider>
      </LanguageProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
export default App;
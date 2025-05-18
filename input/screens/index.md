# PandaHabit UI 界面CSV文件索引

本文档列出了所有已创建的界面CSV文件及其对应的界面描述。每个CSV文件包含了界面的所有UI元素，包括节点结构、位置、尺寸、样式和AI图像生成提示等信息。

## 已创建的界面文件

1. **闪屏页 (Splash Screen)**
   - 文件: `splash_screen.csv`
   - 描述: 应用启动时显示的第一个界面，包含Logo、加载动画和版本号

2. **引导页 (Onboarding Screen)**
   - 文件: `onboarding_screen.csv`
   - 描述: 新用户首次使用应用时的引导页面，包含5个引导页面和导航按钮

3. **登录/注册页 (Login/Register Screen)**
   - 文件: `login_register_screen.csv`
   - 描述: 用户登录和注册的界面，包含输入框、按钮和第三方登录选项

4. **熊猫初始设置页 (Panda Setup Screen)**
   - 文件: `panda_setup_screen.csv`
   - 描述: 用户首次登录后设置熊猫的界面，包含熊猫命名、外观选择和习惯选择三个步骤

5. **主页/家园 (Home Page)**
   - 文件: `home_page.csv`
   - 描述: 应用的主界面，显示熊猫、准时进度条、互动按钮和任务引导

6. **任务列表页 (Task List Page)**
   - 文件: `task_list_page.csv`
   - 描述: 显示所有任务的列表页面，包含任务卡片、筛选和添加任务按钮

7. **任务详情弹窗 (Task Detail Modal)**
   - 文件: `task_detail_modal.csv`
   - 描述: 点击任务卡片后显示的详情弹窗，包含任务详细信息、奖励和操作按钮

8. **熊猫成长/旅程页 (Panda Journey Page)**
   - 文件: `panda_journey_page.csv`
   - 描述: 显示熊猫成长路径、里程碑和成就的页面，包含三个标签页和底部导航栏

## 待创建的界面文件

以下是根据screens-updated.md文档需要创建的其他界面文件：

9. **幸运抽奖/奖励中心页 (Rewards Page)**
   - 文件: `rewards_page.csv`
   - 描述: 用于抽奖和查看奖励历史的页面，包含抽奖机器、奖池预览和奖励历史列表

1. **商店页 (Shop Page)**
   - 文件: `shop_page.csv`
   - 描述: 显示可购买商品的商店页面，包含商品网格、限时商品和VIP订阅入口

2. **商品详情页 (Item Details Page)**
   - 文件: `item_details_page.csv`
   - 描述: 显示商品详细信息和购买选项的页面，包含商品预览、属性信息、试穿功能和相关商品推荐

3. **熊猫互动/详情页 (Panda Interaction Page)**
   - 文件: `panda_interaction_page.csv`
   - 描述: 与熊猫互动和查看熊猫详细信息的页面，包含状态、皮肤和互动三个标签页

4. **心情打卡/反思模块 (Mood Check Page)**
   - 文件: `mood_check_page.csv`
   - 描述: 用于记录心情和反思的页面，包含心情选择、反思输入和历史记录

5. **个人资料/设置页 (Profile Page)**
   - 文件: `profile_page.csv`
   - 描述: 显示用户信息和应用设置的页面，包含个人资料和设置两个标签页

6. **VIP特权总览页 (VIP Benefits Page)**
   - 文件: `vip_benefits_page.csv`
   - 描述: 展示VIP特权和价值的页面，包含VIP状态信息、特权列表和订阅按钮

7. **订阅选择页 (Subscription Page)**
   - 文件: `subscription_page.csv`
   - 描述: 选择VIP订阅计划的页面，包含月度、季度和年度套餐选项

8. **VIP相关弹窗 (VIP Modals)**
   - 文件: `vip_modals.csv`
   - 描述: VIP相关的各种弹窗，包含VIP试用弹窗、VIP到期弹窗和VIP购买成功弹窗

9. **通知中心/消息页 (Notification Page)**
   - 文件: `notification_page.csv`
   - 描述: 显示系统通知和消息的页面，包含系统和消息两个标签页

10. **帮助与反馈/FAQ页 (Help Page)**
    - 文件: `help_page.csv`
    - 描述: 提供帮助信息和反馈入口的页面，包含FAQ和反馈两个标签页

## 使用说明

1. 每个CSV文件包含以下列：
   - 节点名: UI元素的唯一标识符
   - 父节点: 该元素所属的父元素
   - 类型: 元素类型（Node, Sprite, Label, Button等）
   - 组件: 附加组件（Animation, ParticleSystem等）
   - 资源: 使用的资源文件名
   - 备注: 元素的中文描述
   - 位置和尺寸: pos_x, pos_y, width, height
   - 锚点: anchor_x, anchor_y
   - 显示属性: opacity, visible, scale_x, scale_y, rotation
   - 布局: layout, padding, spacing
   - 文本属性: font_size, color, align, overflow, line_height
   - 其他属性: size_mode, trim, transition, zoom_scale, target等
   - AI图像提示: 用于生成UI资源的AI提示描述

2. 实现步骤：
   - 根据CSV文件创建UI界面结构
   - 使用AI图像提示生成所需的UI资源
   - 按照CSV文件中的属性设置UI元素
   - 实现相应的交互逻辑

3. 注意事项：
   - 所有界面应遵循华丽游戏风格
   - 所有图标应采用水墨画风格
   - 所有页面应实现骨架屏加载
   - 所有静态文本应支持多语言
   - 所有弹窗应采用传统窗棂样式

# 设备均价 DeviceDaily

记录各类设备（手机 / 电脑 / 手表 / 汽车等）的购入价格与日期，自动计算**日均成本**——随着时间推移逐渐下降。可设置期望日均价，追踪摊薄进度。数据完全本地存储。

> 数据仅保存在设备本地，无任何联网与云端上传。

## 演示 Demo

<p align="center">
  <img src="docs/demo.gif" width="280" alt="DeviceDaily 功能演示：添加设备、查看日均成本与摊薄进度" />
</p>

演示内容：添加设备 → 设置购入日期与期望日均价 → 卡片展示当前日均价、已用天数与达标进度 → 汇总面板实时更新。

## 技术栈

- React Native 0.88 (bare, TypeScript)
- 导航：@react-navigation/native-stack
- 动画：GSAP 3（补间普通对象 → Animated.Value 桥接）
- 存储：AsyncStorage + JSON（仓储接口抽象，可替换云端实现）
- i18n：内置轻量中英双语，可切换并持久化

## 目录结构

```
src/
├── app/                 # 应用入口与导航
├── core/                # 与业务无关的基础设施
│   ├── animation/       # GSAP 桥接
│   ├── i18n/            # 国际化
│   ├── storage/         # AsyncStorage 封装
│   └── theme/           # 主题 tokens（亮暗色）
├── components/          # 通用 UI 组件（Screen/Text/Button/Field）
├── data/                # 数据层：仓储接口 + 本地实现
├── domain/              # 领域层：设备模型 + 日均成本纯算法
└── features/
    └── devices/         # 设备功能模块（screens/components/hooks）
```

分层原则：`features → data/domain → core`，依赖单向；算法（`domain/pricing.ts`）为纯函数，均有单元测试。

## 开发

```bash
npm install
cd ios && pod install   # iOS 首次需要

npm start               # Metro
npm run ios             # 编译运行 iOS
npm run android         # 编译运行 Android

npm run typecheck       # 类型检查
npm run lint            # ESLint
npm test                # 单元测试
```

### 本机构建环境备注

- Android：SDK 位于 `/opt/homebrew/share/android-commandlinetools`（已写入 `android/local.properties`，该文件不入库），JDK 17 位于 `~/Developer/tools/jdk-17.0.21+9`，构建时设置 `JAVA_HOME` 指向它
- iOS：Xcode 27 + CocoaPods；Podfile 的 post_install 已统一 Pods 部署目标，解决 Xcode 27 最低支持 iOS 15 的问题
- compileSdk 使用 36（SDK 仓库暂未发布 37 正式版）

## 算法说明

- 已使用天数：购入当天记为第 1 天
- 日均成本 = 价格 ÷ 已使用天数（随时间递减）
- 目标达标：已使用天数 ≥ 价格 ÷ 期望日均价 时达成
- 摊薄进度 = 已使用天数 ÷ 达标所需天数（上限 1）

## 下载安装

在 [Releases](../../releases) 页面下载 APK 安装包（当前 v0.0.1 支持 Android）。
iOS 端需自行克隆仓库编译。

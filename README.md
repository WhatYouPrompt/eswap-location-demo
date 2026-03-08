# ESwap 智能选址系统 Demo

智能换电柜选址系统演示版本，基于 Next.js + Leaflet.js 开发。

## 功能特性

- **热力图可视化** - 展示骑手活跃度分布，直观暴露需求真空区
- **智能评分** - 5维度加权评分（骑手活跃度、POI密度、租金成本、电网稳定性、竞品距离）
- **ROI测算** - 自动计算回本周期和收益预测
- **点位录入** - 地图点击选点，快速录入候选点位

## 技术栈

- **前端框架**: Next.js 14 + React 18
- **UI组件库**: Ant Design 5.x
- **地图组件**: Leaflet.js + OpenStreetMap
- **样式方案**: Tailwind CSS
- **开发语言**: TypeScript

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 项目结构

```
eswap-demo/
├── app/                    # Next.js 页面
├── components/             # React 组件
│   ├── Header/             # 顶部导航
│   ├── MapView/            # 地图组件
│   └── DrawerPanel/        # 右侧抽屉
├── data/                   # Mock 数据
├── utils/                  # 工具函数
├── constants/              # 业务配置
└── vercel.json             # 部署配置
```

## 部署

### Vercel部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

或直接在 [Vercel](https://vercel.com) 导入 GitHub 仓库。

## 业务参数配置

编辑 `constants/config.ts` 可调整：

- ROI参数（柜机成本、ARPU等）
- 评分权重
- 地图中心点和缩放级别

## 目标城市

Demo 聚焦巴基斯坦拉合尔（Lahore）区域。

## License

MIT
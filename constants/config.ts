// ESwap 业务配置常量

export const CONFIG = {
  // ROI 计算参数
  ROI: {
    CAPEX: 600000,           // 柜机投入成本 (PKR)
    ARPU: 12700,             // 混合ARPU (PKR/月) - 30%单电 + 70%双电
    OPEX_MIN: 35000,         // 最小运营成本 (PKR/月)
    OPEX_MAX: 55000,         // 最大运营成本 (PKR/月)
    SINGLE_ELEC_FEE: 12000,  // 单电用户费用 (PKR/月)
    DOUBLE_ELEC_FEE: 13000,  // 双电用户费用 (PKR/月)
    SINGLE_ELEC_RATIO: 0.3,  // 单电用户比例
    DOUBLE_ELEC_RATIO: 0.7,  // 双电用户比例
  },

  // 评分权重
  SCORE_WEIGHTS: {
    riderActivity: 0.30,      // 骑手活跃度
    poiDensity: 0.25,         // POI密度
    rentCost: 0.20,           // 租金成本
    powerStability: 0.15,     // 电网稳定性
    competitorDistance: 0.10  // 竞品距离
  },

  // 评分等级阈值
  SCORE_THRESHOLDS: {
    AUTO_APPROVE: 80,         // 自动通过阈值
    MANUAL_REVIEW: 60,        // 人工审批阈值
  },

  // 地图配置
  MAP: {
    CENTER: [31.5204, 74.3587] as [number, number],  // 拉合尔中心坐标
    ZOOM: 13,
    CABINET_COVERAGE_RADIUS: 500,  // 电柜覆盖半径(米)
  },

  // 电网稳定性选项
  POWER_STABILITY_OPTIONS: [
    { value: 5, label: '非常稳定', description: '极少停电，电压稳定' },
    { value: 4, label: '较稳定', description: '偶尔停电，基本不影响运营' },
    { value: 3, label: '一般', description: '每周停电1-2次，需要备用电源' },
    { value: 2, label: '不稳定', description: '频繁停电，必须配备发电机' },
    { value: 1, label: '极不稳定', description: '几乎每天停电，电力改造成本高' },
  ],

  // 租金评分参考值 (PKR/月)
  RENT_REFERENCE: {
    LOW: 10000,      // 低租金
    MEDIUM: 20000,   // 中等租金
    HIGH: 30000,     // 高租金
  }
}

export default CONFIG
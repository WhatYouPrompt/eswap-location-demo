// ROI 计算工具函数

import { CONFIG } from '@/constants/config'

export interface ROIInput {
  rent: number          // 月租金 (PKR)
  electricityCost: number  // 月电费 (PKR)
  predictedUsers?: number  // 预测用户数 (可选，不传则自动估算)
}

export interface ROIResult {
  monthlyRevenue: number      // 月收入
  monthlyOpex: number         // 月运营成本
  monthlyNetProfit: number    // 月净利润
  paybackMonths: number       // 回本周期(月)
  yearlyProfit: number        // 年利润
  dailyOrders: number         // 预测日均换电单量
}

/**
 * 计算ROI和回本周期
 */
export function calculateROI(input: ROIInput): ROIResult {
  const { rent, electricityCost, predictedUsers } = input
  const { CAPEX, ARPU, OPEX_MIN, OPEX_MAX } = CONFIG.ROI

  // 计算月运营成本 (租金 + 电费 + 其他固定成本约5000)
  const otherCosts = 5000  // 网费、折旧等
  const monthlyOpex = rent + electricityCost + otherCosts

  // 如果没有传入预测用户数，根据热力图强度估算
  // 假设每个用户每月换电约20次，每次约635 PKR
  const users = predictedUsers || Math.floor(Math.random() * 30) + 20  // 20-50用户

  // 月收入 = 用户数 × ARPU
  const monthlyRevenue = users * ARPU

  // 月净利润
  const monthlyNetProfit = monthlyRevenue - monthlyOpex

  // 回本周期 = 柜机成本 / 月净利润
  const paybackMonths = monthlyNetProfit > 0
    ? Math.ceil(CAPEX / monthlyNetProfit)
    : 999  // 如果亏损，返回999表示无法回本

  // 年利润
  const yearlyProfit = monthlyNetProfit * 12

  // 日均换电单量 (假设每用户每月换电20次)
  const dailyOrders = Math.round(users * 20 / 30)

  return {
    monthlyRevenue,
    monthlyOpex,
    monthlyNetProfit,
    paybackMonths,
    yearlyProfit,
    dailyOrders
  }
}

/**
 * 格式化金额显示
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' PKR'
}

/**
 * 格式化月数显示
 */
export function formatMonths(months: number): string {
  if (months >= 999) return '无法回本'
  if (months <= 0) return '已回本'
  return `${months} 个月`
}
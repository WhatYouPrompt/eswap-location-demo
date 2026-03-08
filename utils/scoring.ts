// 评分计算工具函数

import { CONFIG } from '@/constants/config'

export interface ScoringInput {
  lat: number
  lng: number
  rent: number              // 月租金 (PKR)
  powerStability: number    // 电网稳定性 1-5
}

export interface ScoreDetail {
  dimension: string
  score: number
  weight: number
  weightedScore: number
  description: string
}

export interface ScoringResult {
  totalScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  decision: 'auto_approve' | 'manual_review' | 'reject'
  details: ScoreDetail[]
  recommendation: string
}

/**
 * 计算综合评分
 */
export function calculateScore(input: ScoringInput): ScoringResult {
  const { rent, powerStability } = input
  const weights = CONFIG.SCORE_WEIGHTS
  const rentRef = CONFIG.RENT_REFERENCE

  // 1. 骑手活跃度评分 (Mock: 基于位置随机生成 60-100)
  const riderActivityScore = Math.floor(Math.random() * 40) + 60

  // 2. POI密度评分 (Mock: 基于位置随机生成 55-95)
  const poiDensityScore = Math.floor(Math.random() * 40) + 55

  // 3. 租金成本评分 (越低越好)
  let rentScore: number
  if (rent <= rentRef.LOW) {
    rentScore = 100
  } else if (rent <= rentRef.MEDIUM) {
    rentScore = 80 + ((rentRef.MEDIUM - rent) / (rentRef.MEDIUM - rentRef.LOW)) * 20
  } else if (rent <= rentRef.HIGH) {
    rentScore = 50 + ((rentRef.HIGH - rent) / (rentRef.HIGH - rentRef.MEDIUM)) * 30
  } else {
    rentScore = Math.max(0, 50 - ((rent - rentRef.HIGH) / rentRef.HIGH) * 50)
  }

  // 4. 电网稳定性评分 (直接使用输入值转换为100分制)
  const powerStabilityScore = powerStability * 20  // 1-5 转换为 20-100

  // 5. 竞品距离评分 (Mock: 随机生成 50-90)
  const competitorDistanceScore = Math.floor(Math.random() * 40) + 50

  // 构建评分明细
  const details: ScoreDetail[] = [
    {
      dimension: '骑手活跃度',
      score: Math.round(riderActivityScore),
      weight: weights.riderActivity,
      weightedScore: riderActivityScore * weights.riderActivity,
      description: getRiderActivityDesc(riderActivityScore)
    },
    {
      dimension: 'POI密度',
      score: Math.round(poiDensityScore),
      weight: weights.poiDensity,
      weightedScore: poiDensityScore * weights.poiDensity,
      description: getPoiDensityDesc(poiDensityScore)
    },
    {
      dimension: '租金成本',
      score: Math.round(rentScore),
      weight: weights.rentCost,
      weightedScore: rentScore * weights.rentCost,
      description: getRentDesc(rent, rentScore)
    },
    {
      dimension: '电网稳定性',
      score: Math.round(powerStabilityScore),
      weight: weights.powerStability,
      weightedScore: powerStabilityScore * weights.powerStability,
      description: getPowerStabilityDesc(powerStability)
    },
    {
      dimension: '竞品距离',
      score: Math.round(competitorDistanceScore),
      weight: weights.competitorDistance,
      weightedScore: competitorDistanceScore * weights.competitorDistance,
      description: getCompetitorDistanceDesc(competitorDistanceScore)
    }
  ]

  // 计算总分
  const totalScore = Math.round(details.reduce((sum, d) => sum + d.weightedScore, 0))

  // 确定等级和决策
  const grade = getGrade(totalScore)
  const decision = getDecision(totalScore)
  const recommendation = getRecommendation(totalScore, details)

  return {
    totalScore,
    grade,
    decision,
    details,
    recommendation
  }
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function getDecision(score: number): 'auto_approve' | 'manual_review' | 'reject' {
  if (score >= CONFIG.SCORE_THRESHOLDS.AUTO_APPROVE) return 'auto_approve'
  if (score >= CONFIG.SCORE_THRESHOLDS.MANUAL_REVIEW) return 'manual_review'
  return 'reject'
}

function getRiderActivityDesc(score: number): string {
  if (score >= 85) return '骑手活动频繁区域，换电需求旺盛'
  if (score >= 70) return '骑手活动较为活跃，有一定换电需求'
  return '骑手活动较少，需评估需求潜力'
}

function getPoiDensityDesc(score: number): string {
  if (score >= 85) return '周边餐饮/商圈密集，外卖订单量大'
  if (score >= 70) return '周边有一定商业配套，订单量中等'
  return '周边商业较少，需开拓市场'
}

function getRentDesc(rent: number, score: number): string {
  if (score >= 80) return `租金${rent} PKR，成本优势明显`
  if (score >= 60) return `租金${rent} PKR，成本适中`
  return `租金${rent} PKR，成本偏高，需评估收益`
}

function getPowerStabilityDesc(level: number): string {
  const option = CONFIG.POWER_STABILITY_OPTIONS.find(o => o.value === level)
  return option ? option.description : '未知'
}

function getCompetitorDistanceDesc(score: number): string {
  if (score >= 80) return '竞品距离较远，市场竞争压力小'
  if (score >= 60) return '有竞品存在，需差异化竞争'
  return '竞品密集区域，竞争激烈'
}

function getRecommendation(score: number, details: ScoreDetail[]): string {
  if (score >= 80) {
    return '✅ 优质点位，建议优先推进签约'
  }

  const weakPoints = details.filter(d => d.score < 70).map(d => d.dimension)

  if (score >= 60) {
    if (weakPoints.length > 0) {
      return `⚠️ 需关注${weakPoints.join('、')}等因素，建议实地考察后决定`
    }
    return '⚠️ 中等点位，建议综合考虑后决策'
  }

  return '❌ 不建议在此点位投放，请寻找其他候选位置'
}

/**
 * 获取决策文本
 */
export function getDecisionText(decision: string): string {
  switch (decision) {
    case 'auto_approve':
      return '自动通过'
    case 'manual_review':
      return '待人工审批'
    case 'reject':
      return '建议驳回'
    default:
      return '未知'
  }
}

/**
 * 获取等级颜色
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return '#52c41a'  // green
    case 'B':
      return '#1890ff'  // blue
    case 'C':
      return '#faad14'  // orange
    case 'D':
      return '#fa8c16'  // orange-dark
    case 'F':
      return '#ff4d4f'  // red
    default:
      return '#8c8c8c'  // gray
  }
}
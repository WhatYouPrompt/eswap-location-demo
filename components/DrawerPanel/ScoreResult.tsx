'use client'

import { Card, Progress, Button, Space, Descriptions, Tag, Divider, Statistic, Row, Col } from 'antd'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import { ScoringResult, getDecisionText, getGradeColor } from '@/utils/scoring'
import { ROIResult, formatCurrency, formatMonths } from '@/utils/calculator'

interface ScoreResultProps {
  scoringResult: ScoringResult | null
  roiResult: ROIResult | null
  selectedLocation: { lat: number; lng: number } | null
  onReset: () => void
  onClose: () => void
}

export default function ScoreResult({
  scoringResult,
  roiResult,
  selectedLocation,
  onReset,
  onClose
}: ScoreResultProps) {
  if (!scoringResult || !roiResult) {
    return <div>加载中...</div>
  }

  const getDecisionIcon = () => {
    switch (scoringResult.decision) {
      case 'auto_approve':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
      case 'manual_review':
        return <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
      case 'reject':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
    }
  }

  const getDecisionTag = () => {
    switch (scoringResult.decision) {
      case 'auto_approve':
        return <Tag color="success">自动通过</Tag>
      case 'manual_review':
        return <Tag color="warning">待人工审批</Tag>
      case 'reject':
        return <Tag color="error">建议驳回</Tag>
    }
  }

  return (
    <div>
      {/* 位置信息 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EnvironmentOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          <div style={{ fontSize: 13, color: '#666' }}>
            {selectedLocation?.lat.toFixed(6)}, {selectedLocation?.lng.toFixed(6)}
          </div>
        </div>
      </Card>

      {/* 综合评分 */}
      <Card
        style={{ marginBottom: 16, textAlign: 'center' }}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 'bold', color: getGradeColor(scoringResult.grade) }}>
            {scoringResult.totalScore}
          </span>
          <span style={{ fontSize: 24, color: '#999' }}>/100</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Tag
            color={getGradeColor(scoringResult.grade)}
            style={{ fontSize: 16, padding: '4px 12px' }}
          >
            等级 {scoringResult.grade}
          </Tag>
          {getDecisionTag()}
        </div>
        <Progress
          percent={scoringResult.totalScore}
          strokeColor={getGradeColor(scoringResult.grade)}
          showInfo={false}
        />
      </Card>

      {/* 各维度得分 */}
      <Card title="评分明细" size="small" style={{ marginBottom: 16 }}>
        {scoringResult.details.map((detail, index) => (
          <div key={index} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{detail.dimension}</span>
              <span style={{ fontWeight: 500 }}>{detail.score}分</span>
            </div>
            <Progress
              percent={detail.score}
              size="small"
              strokeColor={detail.score >= 80 ? '#52c41a' : detail.score >= 60 ? '#faad14' : '#ff4d4f'}
              showInfo={false}
            />
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
              {detail.description}
            </div>
          </div>
        ))}
      </Card>

      {/* ROI 测算 */}
      <Card title="ROI 测算" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="预计回本周期"
              value={formatMonths(roiResult.paybackMonths)}
              valueStyle={{
                color: roiResult.paybackMonths <= 12 ? '#52c41a' : roiResult.paybackMonths <= 18 ? '#faad14' : '#ff4d4f',
                fontSize: 20
              }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="预测日均换电"
              value={roiResult.dailyOrders}
              suffix="单"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <Descriptions column={1} size="small">
          <Descriptions.Item label="月收入">{formatCurrency(roiResult.monthlyRevenue)}</Descriptions.Item>
          <Descriptions.Item label="月运营成本">{formatCurrency(roiResult.monthlyOpex)}</Descriptions.Item>
          <Descriptions.Item label="月净利润">
            <span style={{ color: roiResult.monthlyNetProfit > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
              {formatCurrency(roiResult.monthlyNetProfit)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="年利润">{formatCurrency(roiResult.yearlyProfit)}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 建议 */}
      <Card
        size="small"
        style={{
          marginBottom: 16,
          background: scoringResult.decision === 'auto_approve' ? '#f6ffed' :
                     scoringResult.decision === 'manual_review' ? '#fffbe6' : '#fff2f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          {getDecisionIcon()}
          <div>{scoringResult.recommendation}</div>
        </div>
      </Card>

      {/* 操作按钮 */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button onClick={onReset}>重新评估</Button>
        <Button type="primary" onClick={onClose}>
          提交点位
        </Button>
      </Space>
    </div>
  )
}
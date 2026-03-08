'use client'

import { useState, useCallback } from 'react'
import { message, FloatButton } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import DrawerPanel from '@/components/DrawerPanel'
import { calculateScore, ScoringResult } from '@/utils/scoring'
import { calculateROI, ROIResult } from '@/utils/calculator'
import heatmapData from '@/data/heatmap_data.json'
import cabinetsData from '@/data/existing_cabinets.json'

// 动态导入地图组件（避免 SSR 问题）
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      地图加载中...
    </div>
  )
})

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null)
  const [roiResult, setRoiResult] = useState<ROIResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  // 处理地图点击
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setScoringResult(null)
    setRoiResult(null)
    setShowResult(false)
    setDrawerOpen(true)
  }, [])

  // 处理表单提交
  const handleFormSubmit = useCallback((values: { rent: number; electricityCost: number; powerStability: number }) => {
    if (!selectedLocation) return

    // 计算评分
    const score = calculateScore({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      rent: values.rent,
      powerStability: values.powerStability
    })

    // 计算ROI
    const roi = calculateROI({
      rent: values.rent,
      electricityCost: values.electricityCost
    })

    setScoringResult(score)
    setRoiResult(roi)
    setShowResult(true)
  }, [selectedLocation])

  // 重置表单
  const handleReset = useCallback(() => {
    setShowResult(false)
    setScoringResult(null)
    setRoiResult(null)
  }, [])

  // 关闭抽屉
  const handleClose = useCallback(() => {
    setDrawerOpen(false)
    // 延迟重置，等动画结束
    setTimeout(() => {
      setShowResult(false)
      setScoringResult(null)
      setRoiResult(null)
    }, 300)
  }, [])

  // 处理提交点位
  const handleSubmitLocation = useCallback(() => {
    message.success('点位已提交成功！')
    handleClose()
  }, [handleClose])

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 顶部导航 */}
      <Header />

      {/* 地图区域 */}
      <div style={{
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <MapView
          onMapClick={handleMapClick}
          heatmapData={heatmapData.points}
          existingCabinets={cabinetsData.cabinets}
        />
      </div>

      {/* 图例 */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          background: '#fff',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 500
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>图例</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff4d4f' }} />
            <span>高活跃区</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#faad14' }} />
            <span>中等活跃区</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#52c41a' }} />
            <span>低活跃区</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 10
            }}>
              ⚡
            </div>
            <span>现有电柜</span>
          </div>
        </div>
      </div>

      {/* 操作提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          background: '#fff',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 500,
          maxWidth: 280
        }}
      >
        <div style={{ fontSize: 13, color: '#666' }}>
          <strong>操作提示：</strong>点击地图上任意位置，录入候选点位信息，系统将自动计算评分和回本周期。
        </div>
      </div>

      {/* 右侧抽屉 */}
      <DrawerPanel
        open={drawerOpen}
        onClose={handleClose}
        selectedLocation={selectedLocation}
        scoringResult={scoringResult}
        roiResult={roiResult}
        showResult={showResult}
        onSubmit={handleFormSubmit}
        onReset={handleReset}
      />

      {/* 帮助按钮 */}
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="primary"
        style={{ right: 24, bottom: 100 }}
        tooltip="点击地图选择点位，填写信息后获取评分"
      />
    </main>
  )
}
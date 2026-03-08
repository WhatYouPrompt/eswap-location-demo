'use client'

import { Drawer } from 'antd'
import LocationForm from './LocationForm'
import ScoreResult from './ScoreResult'
import { ScoringResult } from '@/utils/scoring'
import { ROIResult } from '@/utils/calculator'

interface DrawerPanelProps {
  open: boolean
  onClose: () => void
  selectedLocation: { lat: number; lng: number } | null
  scoringResult: ScoringResult | null
  roiResult: ROIResult | null
  showResult: boolean
  onSubmit: (values: { rent: number; electricityCost: number; powerStability: number }) => void
  onReset: () => void
}

export default function DrawerPanel({
  open,
  onClose,
  selectedLocation,
  scoringResult,
  roiResult,
  showResult,
  onSubmit,
  onReset
}: DrawerPanelProps) {
  return (
    <Drawer
      title={showResult ? '选址评估结果' : '新增候选点位'}
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px' }
      }}
    >
      {!showResult ? (
        <LocationForm
          selectedLocation={selectedLocation}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      ) : (
        <ScoreResult
          scoringResult={scoringResult}
          roiResult={roiResult}
          selectedLocation={selectedLocation}
          onReset={onReset}
          onClose={onClose}
        />
      )}
    </Drawer>
  )
}
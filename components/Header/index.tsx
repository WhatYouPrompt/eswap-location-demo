'use client'

import { Select, Space } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'

export default function Header() {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: '#001529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThunderboltOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
          ESwap 智能选址系统
        </span>
        <span
          style={{
            background: '#1890ff',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 12,
            marginLeft: 8
          }}
        >
          Demo
        </span>
      </div>

      <Space>
        <Select
          defaultValue="lahore"
          style={{ width: 150 }}
          options={[
            { value: 'lahore', label: '拉合尔 (Lahore)' },
            { value: 'karachi', label: '卡拉奇 (Karachi)', disabled: true },
            { value: 'islamabad', label: '伊斯兰堡 (Islamabad)', disabled: true },
          ]}
        />
      </Space>
    </header>
  )
}
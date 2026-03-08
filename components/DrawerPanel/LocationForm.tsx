'use client'

import { Form, InputNumber, Select, Button, Space, Card, Descriptions } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { CONFIG } from '@/constants/config'

interface LocationFormProps {
  selectedLocation: { lat: number; lng: number } | null
  onSubmit: (values: { rent: number; electricityCost: number; powerStability: number }) => void
  onCancel: () => void
}

export default function LocationForm({ selectedLocation, onSubmit, onCancel }: LocationFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values: { rent: number; electricityCost: number; powerStability: number }) => {
    onSubmit(values)
  }

  return (
    <div>
      {/* 位置信息卡片 */}
      <Card
        size="small"
        style={{ marginBottom: 16 }}
        styles={{
          body: { padding: '12px 16px' }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EnvironmentOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>选中位置</div>
            <div style={{ color: '#666', fontSize: 13 }}>
              纬度: {selectedLocation?.lat.toFixed(6)}<br/>
              经度: {selectedLocation?.lng.toFixed(6)}
            </div>
          </div>
        </div>
      </Card>

      {/* 录入表单 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          rent: 15000,
          electricityCost: 25000,
          powerStability: 3
        }}
      >
        <Form.Item
          name="rent"
          label="月租金 (PKR)"
          rules={[{ required: true, message: '请输入月租金' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100000}
            step={1000}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item
          name="electricityCost"
          label="月电费预估 (PKR)"
          rules={[{ required: true, message: '请输入电费预估' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100000}
            step={1000}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item
          name="powerStability"
          label="电网稳定性"
          rules={[{ required: true, message: '请选择电网稳定性' }]}
        >
          <Select
            placeholder="请选择"
            options={CONFIG.POWER_STABILITY_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label,
              description: opt.description
            }))}
            optionRender={(option) => (
              <div>
                <div style={{ fontWeight: 500 }}>{option.label}</div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {option.data.description}
                </div>
              </div>
            )}
          />
        </Form.Item>

        {/* 成本参考 */}
        <Card
          size="small"
          title="成本参考"
          style={{ marginBottom: 16, background: '#fafafa' }}
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="低租金">{CONFIG.RENT_REFERENCE.LOW.toLocaleString()} PKR</Descriptions.Item>
            <Descriptions.Item label="中等租金">{CONFIG.RENT_REFERENCE.MEDIUM.toLocaleString()} PKR</Descriptions.Item>
            <Descriptions.Item label="高租金">{CONFIG.RENT_REFERENCE.HIGH.toLocaleString()} PKR</Descriptions.Item>
          </Descriptions>
        </Card>

        <Form.Item style={{ marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              计算评分
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
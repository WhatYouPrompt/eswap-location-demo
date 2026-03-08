'use client'

import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修复 Leaflet 默认图标问题 - 使用CDN地址避免TypeScript类型问题
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// 自定义电柜图标
const cabinetIcon = L.divIcon({
  className: 'cabinet-marker',
  html: `<div style="
    background: #1890ff;
    border: 2px solid #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  ">⚡</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

interface MapViewProps {
  onMapClick: (lat: number, lng: number) => void
  heatmapData: Array<{ lat: number; lng: number; intensity: number }>
  existingCabinets: Array<{
    id: string
    name: string
    lat: number
    lng: number
    dailyOrders: number
    utilization: number
  }>
}

export default function MapView({ onMapClick, heatmapData, existingCabinets }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const heatmapLayerRef = useRef<L.Layer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [31.5204, 74.3587],
      zoom: 13,
      zoomControl: true,
    })

    // 添加 OpenStreetMap 底图
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapRef.current = map

    // 初始化图层组
    markersLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 添加热力图层
  useEffect(() => {
    if (!mapRef.current || !heatmapData.length) return

    // 移除旧的热力图层
    if (heatmapLayerRef.current) {
      mapRef.current.removeLayer(heatmapLayerRef.current)
    }

    // 使用圆形标记模拟热力图效果
    const heatLayer = L.layerGroup()

    heatmapData.forEach(point => {
      const color = getHeatColor(point.intensity)
      L.circleMarker([point.lat, point.lng], {
        radius: 8,
        fillColor: color,
        color: color,
        weight: 0,
        opacity: 0.6,
        fillOpacity: 0.5
      }).addTo(heatLayer)
    })

    heatLayer.addTo(mapRef.current)
    heatmapLayerRef.current = heatLayer

    return () => {
      if (mapRef.current && heatmapLayerRef.current) {
        mapRef.current.removeLayer(heatmapLayerRef.current)
      }
    }
  }, [heatmapData])

  // 添加现有电柜标记
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !existingCabinets.length) return

    markersLayerRef.current.clearLayers()

    existingCabinets.forEach(cabinet => {
      // 添加电柜标记
      L.marker([cabinet.lat, cabinet.lng], { icon: cabinetIcon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${cabinet.name}</strong><br/>
            日均换电: ${cabinet.dailyOrders} 单<br/>
            利用率: ${(cabinet.utilization * 100).toFixed(0)}%
          </div>
        `)
        .addTo(markersLayerRef.current!)

      // 添加覆盖半径圆圈
      L.circle([cabinet.lat, cabinet.lng], {
        radius: 500,
        color: '#1890ff',
        fillColor: '#1890ff',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '5, 5'
      }).addTo(markersLayerRef.current!)
    })
  }, [existingCabinets])

  // 地图点击事件
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    onMapClick(e.latlng.lat, e.latlng.lng)
  }, [onMapClick])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.on('click', handleMapClick)

    return () => {
      mapRef.current?.off('click', handleMapClick)
    }
  }, [handleMapClick])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  )
}

// 根据强度获取颜色
function getHeatColor(intensity: number): string {
  if (intensity >= 0.8) return '#ff4d4f'  // 红色 - 高活跃
  if (intensity >= 0.6) return '#fa8c16'  // 橙色 - 中高活跃
  if (intensity >= 0.4) return '#faad14'  // 黄色 - 中等活跃
  if (intensity >= 0.2) return '#52c41a'  // 绿色 - 低活跃
  return '#1890ff'  // 蓝色 - 很低活跃
}
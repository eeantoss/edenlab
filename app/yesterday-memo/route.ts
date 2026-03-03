import { NextResponse } from 'next/server'

export const revalidate = 0

// 昨日小记 - 返回固定格式给 Star Office UI 用
export async function GET() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  return NextResponse.json({
    date: dateStr,
    points: [
      '跟单 bot 运行中，追踪 11 个聪明钱钱包',
      '止盈+30%卖半仓，止损-20%全出',
      '每日目标 +20U，稳步推进'
    ],
    poem: '长风破浪会有时，直挂云帆济沧海。'
  }, {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  })
}

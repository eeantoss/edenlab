import { NextRequest, NextResponse } from 'next/server'

// QuickNode 配置
const QUICKNODE_ENDPOINT = process.env.QUICKNODE_ENDPOINT || ''

export const dynamic = 'force-dynamic'

// RPC 调用函数
async function makeRPCCall(method: string, params: any[] = []) {
  if (!QUICKNODE_ENDPOINT) {
    return {
      error: 'QuickNode endpoint not configured',
      message: 'Please set QUICKNODE_ENDPOINT environment variable'
    }
  }

  try {
    const response = await fetch(QUICKNODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: method,
        params: params
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}`,
        message: response.statusText
      }
    }

    return await response.json()
  } catch (error) {
    return {
      error: 'RPC call failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// GET /api/quicknode/block - 获取最新区块
export async function GET() {
  const result = await makeRPCCall('eth_blockNumber')

  if (result.error) {
    return NextResponse.json(result, { status: 500 })
  }

  const blockNumber = parseInt(result.result, 16)

  return NextResponse.json({
    success: true,
    blockNumber,
    blockNumberHex: result.result
  })
}

// POST /api/quicknode/balance - 获取地址余额
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { address } = body

    if (!address) {
      return NextResponse.json({
        error: 'Address is required'
      }, { status: 400 })
    }

    const result = await makeRPCCall('eth_getBalance', [address, 'latest'])

    if (result.error) {
      return NextResponse.json(result, { status: 500 })
    }

    const balanceWei = parseInt(result.result, 16)
    const balanceEth = balanceWei / 10**18

    return NextResponse.json({
      success: true,
      address,
      balanceWei,
      balanceEth,
      balanceWeiFormatted: balanceWei.toLocaleString(),
      balanceEthFormatted: balanceEth.toFixed(6)
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request'
    }, { status: 400 })
  }
}

// 自定义 RPC 调用
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { method, params = [] } = body

    if (!method) {
      return NextResponse.json({
        error: 'Method is required'
      }, { status: 400 })
    }

    const result = await makeRPCCall(method, params)

    return NextResponse.json({
      success: true,
      method,
      result: result.result,
      error: result.error
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request'
    }, { status: 400 })
  }
}

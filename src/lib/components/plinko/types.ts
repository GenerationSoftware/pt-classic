import type { VectorMath } from './vectorMath'

export interface Prize {
  size: number
  count: number
  userOdds: number
  userWon: number
}

export type PrizeRowTile = number | '^' | ' '

export interface PlinkoState {
  state: 'ready' | 'playing' | 'done' | 'paused'
  frame: number
  ms: number
  ball: {
    pos: VectorMath.Vector2
    rot: number
    rotVel: number
    vel: VectorMath.Vector2
    acc: VectorMath.Vector2
  }
  nextPrizeRow: number
  prizesWon: number
  prizesTotal: number
}

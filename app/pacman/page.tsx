'use client'

import { useEffect, useRef, useCallback } from 'react'

const CELL = 20
const COLS = 21
const ROWS = 21

// 0=path, 1=wall, 2=dot, 3=power
const MAZE_TEMPLATE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],
  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,0,1,0,0,1,1,1,2,1,1,1,1],
  [1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1],
  [1,1,1,1,2,1,0,1,1,0,0,0,1,1,0,1,2,1,1,1,1],
  [0,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1],
  [1,1,1,1,2,1,0,1,1,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,2,0,2,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']

type Dir = { x: number; y: number }
const DIRS: Record<string, Dir> = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

function cloneMaze() {
  return MAZE_TEMPLATE.map(row => [...row])
}

function countDots(maze: number[][]) {
  return maze.flat().filter(c => c === 2 || c === 3).length
}

interface Ghost {
  x: number
  y: number
  dir: Dir
  frightened: boolean
  frightenedTimer: number
}

function randomDir(): Dir {
  const opts = Object.values(DIRS)
  return opts[Math.floor(Math.random() * opts.length)]
}

function canMove(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false
  return maze[y][x] !== 1
}

export default function PacmanPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    maze: cloneMaze(),
    pacX: 10,
    pacY: 16,
    pacDir: { x: 0, y: 0 } as Dir,
    nextDir: { x: 0, y: 0 } as Dir,
    mouthAngle: 0,
    mouthOpen: true,
    score: 0,
    lives: 3,
    dotsLeft: countDots(cloneMaze()),
    gameOver: false,
    won: false,
    frightTimer: 0,
    ghosts: [
      { x: 9,  y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 10, y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 11, y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 10, y: 10, dir: randomDir(), frightened: false, frightenedTimer: 0 },
    ] as Ghost[],
    animFrame: 0,
  })

  const resetLevel = useCallback(() => {
    const s = stateRef.current
    s.maze = cloneMaze()
    s.pacX = 10; s.pacY = 16
    s.pacDir = { x: 0, y: 0 }
    s.nextDir = { x: 0, y: 0 }
    s.dotsLeft = countDots(s.maze)
    s.score = 0; s.lives = 3
    s.gameOver = false; s.won = false
    s.ghosts = [
      { x: 9,  y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 10, y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 11, y: 9,  dir: randomDir(), frightened: false, frightenedTimer: 0 },
      { x: 10, y: 10, dir: randomDir(), frightened: false, frightenedTimer: 0 },
    ]
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.key === 'r' || e.key === 'R') { resetLevel(); return }
      const d = DIRS[e.key]
      if (d) { s.nextDir = d; e.preventDefault() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [resetLevel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let tick = 0

    const draw = () => {
      const s = stateRef.current
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // maze
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = s.maze[row][col]
          const px = col * CELL
          const py = row * CELL
          if (cell === 1) {
            ctx.fillStyle = '#1a1aff'
            ctx.fillRect(px, py, CELL, CELL)
            ctx.strokeStyle = '#0000aa'
            ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1)
          } else if (cell === 2) {
            ctx.fillStyle = '#ffff99'
            ctx.beginPath()
            ctx.arc(px + CELL / 2, py + CELL / 2, 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (cell === 3) {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(px + CELL / 2, py + CELL / 2, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // ghosts
      for (const g of s.ghosts) {
        const gx = g.x * CELL
        const gy = g.y * CELL
        if (g.frightened) {
          ctx.fillStyle = g.frightenedTimer < 60 && tick % 20 < 10 ? '#ffffff' : '#0000ff'
        } else {
          ctx.fillStyle = GHOST_COLORS[s.ghosts.indexOf(g)]
        }
        ctx.beginPath()
        ctx.arc(gx + CELL / 2, gy + CELL / 2 - 2, CELL / 2 - 2, Math.PI, 0)
        ctx.lineTo(gx + CELL - 2, gy + CELL - 2)
        const waveCount = 3
        for (let i = waveCount; i >= 0; i--) {
          const wx = gx + 2 + ((CELL - 4) / waveCount) * i
          const wy = gy + CELL - 2 - (i % 2 === 0 ? 4 : 0)
          ctx.lineTo(wx, wy)
        }
        ctx.lineTo(gx + 2, gy + CELL - 2)
        ctx.closePath()
        ctx.fill()
        // eyes
        if (!g.frightened) {
          ctx.fillStyle = '#fff'
          ctx.beginPath(); ctx.arc(gx + 7, gy + 7, 3, 0, Math.PI * 2); ctx.fill()
          ctx.beginPath(); ctx.arc(gx + 13, gy + 7, 3, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = '#00f'
          ctx.beginPath(); ctx.arc(gx + 8, gy + 7, 1.5, 0, Math.PI * 2); ctx.fill()
          ctx.beginPath(); ctx.arc(gx + 14, gy + 7, 1.5, 0, Math.PI * 2); ctx.fill()
        }
      }

      // pac-man
      if (!s.gameOver || s.won) {
        const angle = Math.atan2(s.pacDir.y, s.pacDir.x || 1)
        const mouth = s.mouthOpen ? 0.25 : 0.05
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.moveTo(s.pacX * CELL + CELL / 2, s.pacY * CELL + CELL / 2)
        ctx.arc(
          s.pacX * CELL + CELL / 2,
          s.pacY * CELL + CELL / 2,
          CELL / 2 - 1,
          angle + mouth * Math.PI,
          angle + (2 - mouth) * Math.PI
        )
        ctx.closePath()
        ctx.fill()
      }

      // HUD
      ctx.fillStyle = '#fff'
      ctx.font = '14px monospace'
      ctx.fillText(`Score: ${s.score}`, 4, ROWS * CELL + 18)
      ctx.fillText(`Lives: ${'● '.repeat(s.lives).trim()}`, COLS * CELL / 2 - 30, ROWS * CELL + 18)

      if (s.gameOver && !s.won) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, canvas.width, ROWS * CELL)
        ctx.fillStyle = '#FF4444'
        ctx.font = 'bold 28px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, ROWS * CELL / 2 - 10)
        ctx.font = '16px monospace'
        ctx.fillStyle = '#fff'
        ctx.fillText('Presioná R para reiniciar', canvas.width / 2, ROWS * CELL / 2 + 20)
        ctx.textAlign = 'left'
      }

      if (s.won) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, canvas.width, ROWS * CELL)
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 28px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('¡GANASTE!', canvas.width / 2, ROWS * CELL / 2 - 10)
        ctx.font = '16px monospace'
        ctx.fillStyle = '#fff'
        ctx.fillText(`Puntaje: ${s.score}  |  R para jugar de nuevo`, canvas.width / 2, ROWS * CELL / 2 + 20)
        ctx.textAlign = 'left'
      }
    }

    const update = () => {
      const s = stateRef.current
      if (s.gameOver || s.won) return
      tick++

      // pac-man moves every 4 ticks
      if (tick % 4 === 0) {
        s.mouthOpen = !s.mouthOpen
        const nd = s.nextDir
        const nx = s.pacX + nd.x
        const ny = s.pacY + nd.y
        if (canMove(s.maze, nx, ny)) s.pacDir = nd
        const mx = s.pacX + s.pacDir.x
        const my = s.pacY + s.pacDir.y
        if (canMove(s.maze, mx, my)) {
          s.pacX = mx; s.pacY = my
          // tunnel
          if (s.pacX < 0) s.pacX = COLS - 1
          if (s.pacX >= COLS) s.pacX = 0
        }
        const cell = s.maze[s.pacY]?.[s.pacX]
        if (cell === 2) {
          s.maze[s.pacY][s.pacX] = 0
          s.score += 10
          s.dotsLeft--
        } else if (cell === 3) {
          s.maze[s.pacY][s.pacX] = 0
          s.score += 50
          s.dotsLeft--
          s.ghosts.forEach(g => { g.frightened = true; g.frightenedTimer = 200 })
        }
        if (s.dotsLeft <= 0) { s.won = true; return }
      }

      // ghosts move every 6 ticks
      if (tick % 6 === 0) {
        for (const g of s.ghosts) {
          if (g.frightened) {
            g.frightenedTimer--
            if (g.frightenedTimer <= 0) g.frightened = false
          }
          const opts = Object.values(DIRS).filter(d => canMove(s.maze, g.x + d.x, g.y + d.y))
          const noReverse = opts.filter(d => !(d.x === -g.dir.x && d.y === -g.dir.y))
          const choices = noReverse.length > 0 ? noReverse : opts
          if (!g.frightened) {
            // chase pac-man (simple)
            const sorted = choices.sort((a, b) => {
              const da = Math.abs(g.x + a.x - s.pacX) + Math.abs(g.y + a.y - s.pacY)
              const db = Math.abs(g.x + b.x - s.pacX) + Math.abs(g.y + b.y - s.pacY)
              return da - db
            })
            g.dir = Math.random() < 0.7 ? sorted[0] : choices[Math.floor(Math.random() * choices.length)]
          } else {
            g.dir = choices[Math.floor(Math.random() * choices.length)] ?? g.dir
          }
          g.x += g.dir.x; g.y += g.dir.y
          if (g.x < 0) g.x = COLS - 1
          if (g.x >= COLS) g.x = 0
        }
      }

      // collision
      for (const g of s.ghosts) {
        if (g.x === s.pacX && g.y === s.pacY) {
          if (g.frightened) {
            g.frightened = false
            g.x = 10; g.y = 9
            s.score += 200
          } else {
            s.lives--
            if (s.lives <= 0) { s.gameOver = true; return }
            s.pacX = 10; s.pacY = 16
            s.pacDir = { x: 0, y: 0 }
          }
        }
      }
    }

    const loop = setInterval(() => { update(); draw() }, 1000 / 30)
    return () => clearInterval(loop)
  }, [])

  const handleBtn = (key: string) => {
    const d = DIRS[key]
    if (d) stateRef.current.nextDir = d
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-yellow-400 font-bold text-3xl tracking-widest font-mono">PAC-MAN</h1>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL + 24}
        className="border-2 border-blue-600"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 mt-2 md:hidden">
        <div />
        <button onPointerDown={() => handleBtn('ArrowUp')}
          className="bg-gray-800 text-white rounded p-3 text-lg active:bg-gray-600">▲</button>
        <div />
        <button onPointerDown={() => handleBtn('ArrowLeft')}
          className="bg-gray-800 text-white rounded p-3 text-lg active:bg-gray-600">◀</button>
        <button onPointerDown={() => { stateRef.current.gameOver && resetLevel() }}
          className="bg-gray-700 text-white rounded p-3 text-xs">R</button>
        <button onPointerDown={() => handleBtn('ArrowRight')}
          className="bg-gray-800 text-white rounded p-3 text-lg active:bg-gray-600">▶</button>
        <div />
        <button onPointerDown={() => handleBtn('ArrowDown')}
          className="bg-gray-800 text-white rounded p-3 text-lg active:bg-gray-600">▼</button>
        <div />
      </div>
      <p className="text-gray-500 text-sm font-mono hidden md:block">
        Flechas para mover · R para reiniciar
      </p>
    </div>
  )
}

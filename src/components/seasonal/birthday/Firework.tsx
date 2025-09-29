'use client'

import { useCallback, useEffect, useRef } from 'react'

interface ParticleType {
  x: number
  y: number
  color: string
  angle: number
  speed: number
  size: number
  alpha: number
  gravity: number
  update(): void
  draw(ctx: CanvasRenderingContext2D): void
}

interface FireworkType {
  x: number
  y: number
  particles: ParticleType[]
  colors: string[]
  update(): void
  draw(ctx: CanvasRenderingContext2D): void
}

interface FireworkProps {
  children?: React.ReactNode
  className?: string
  particleCount?: number
}

export default function Firework({
  children,
  className = '',
  particleCount = 30,
}: FireworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<FireworkType[]>([])
  const animationIdRef = useRef<number>()

  // 粒子类
  class Particle implements ParticleType {
    x: number
    y: number
    color: string
    angle: number
    speed: number
    size: number
    alpha: number
    gravity: number

    constructor(
      x: number,
      y: number,
      color: string,
      angle: number,
      speed: number,
    ) {
      this.x = x
      this.y = y
      this.color = color
      this.angle = angle
      this.speed = speed
      this.size = Math.random() * 2 + 1 // 粒子大小
      this.alpha = 1 // 透明度
      this.gravity = 0.02 // 重力
    }

    update(): void {
      this.x += Math.cos(this.angle) * this.speed
      this.y += Math.sin(this.angle) * this.speed
      this.speed *= 0.98 // 速度衰减
      this.alpha -= 0.015 // 逐渐消失
      this.speed -= this.gravity // 应用重力
    }

    draw(ctx: CanvasRenderingContext2D): void {
      ctx.globalAlpha = this.alpha
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  // 烟花类
  class Firework implements FireworkType {
    x: number
    y: number
    particles: ParticleType[]
    colors: string[]

    constructor(x: number, y: number, particleCount = 50) {
      this.x = x
      this.y = y
      this.particles = []
      this.colors = ['#ff5733', '#ffbd33', '#33ff57', '#3357ff', '#f033ff']

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2 // 随机角度
        const speed = Math.random() * 3 + 2 // 随机速度
        const color =
          this.colors[Math.floor(Math.random() * this.colors.length)]
        this.particles.push(new Particle(this.x, this.y, color, angle, speed))
      }
    }

    update(): void {
      this.particles.forEach((p, index) => {
        p.update()
        // 移除透明度为0的粒子
        if (p.alpha <= 0) {
          this.particles.splice(index, 1)
        }
      })
    }

    draw(ctx: CanvasRenderingContext2D): void {
      this.particles.forEach((p) => p.draw(ctx))
    }
  }

  // 设置画布尺寸
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height) // 清除画布内容
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)' // 轻微残影效果，使用半透明黑色
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fireworksRef.current.forEach((firework, index) => {
      firework.update()
      firework.draw(ctx)
      // 移除没有粒子的烟花
      if (firework.particles.length === 0) {
        fireworksRef.current.splice(index, 1)
      }
    })

    animationIdRef.current = requestAnimationFrame(animate)
  }, [])

  // 处理点击事件
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      fireworksRef.current.push(new Firework(x, y, particleCount))
    },
    [particleCount],
  )

  useEffect(() => {
    // 初始化画布尺寸
    resizeCanvas()

    // 添加窗口大小变化监听器
    window.addEventListener('resize', resizeCanvas)

    // 开始动画
    animate()
    document.addEventListener('click', handleClick)
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('click', handleClick)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [resizeCanvas, animate])

  return (
    <>
      {children}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none fixed inset-0 ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </>
  )
}

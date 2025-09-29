'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'

interface SnowfallProps {
  maxFlake?: number
  flakeSize?: number
  fallSpeed?: number
}

const Snowfall: React.FC<SnowfallProps> = ({
  maxFlake = 150,
  flakeSize = 10,
  fallSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let loop: number

    // 检测黑暗模式
    // const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    // if (darkModeMediaQuery.matches) return

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = document.body.offsetWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.onresize = resizeCanvas

    // 雪花类
    class FlakeMove {
      x: number
      y: number
      size: number
      maxSize: number
      speed: number
      fallSpeed: number
      velY: number
      velX: number
      stepSize: number
      step: number

      constructor(
        canvasWidth: number,
        canvasHeight: number,
        flakeSize: number,
        fallSpeed: number,
      ) {
        this.x = Math.floor(Math.random() * canvasWidth)
        this.y = Math.floor(Math.random() * canvasHeight)
        this.size = Math.random() * flakeSize + 2
        this.maxSize = flakeSize
        this.speed = Math.random() * 1 + fallSpeed
        this.fallSpeed = fallSpeed
        this.velY = this.speed
        this.velX = 0
        this.stepSize = Math.random() / 30
        this.step = 0
      }

      update() {
        this.velX *= 0.98
        if (this.velY <= this.speed) {
          this.velY = this.speed
        }
        this.velX += Math.cos((this.step += 0.05)) * this.stepSize

        this.y += this.velY
        this.x += this.velX

        if (
          this.x >= canvas!.width ||
          this.x <= 0 ||
          this.y >= canvas!.height ||
          this.y <= 0
        ) {
          this.reset(canvas!.width, canvas!.height)
        }
      }

      reset(width: number, height: number) {
        this.x = Math.floor(Math.random() * width)
        this.y = 0
        this.size = Math.random() * this.maxSize + 2
        this.speed = Math.random() * 1 + this.fallSpeed
        this.velY = this.speed
        this.velX = 0
      }

      render() {
        const snowFlake = ctx!.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size,
        )
        snowFlake.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        snowFlake.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
        snowFlake.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx!.save()
        ctx!.fillStyle = snowFlake
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }
    }

    // 创建雪花
    const createFlakes = () => {
      const flakes: FlakeMove[] = []
      for (let i = 0; i < maxFlake; i++) {
        flakes.push(
          new FlakeMove(canvas.width, canvas.height, flakeSize, fallSpeed),
        )
      }
      return flakes
    }

    const flakes = createFlakes()

    // 绘制雪花
    const drawSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      flakes.forEach((flake) => {
        flake.update()
        flake.render()
      })

      loop = requestAnimationFrame(drawSnow)
    }

    // 启动动画
    drawSnow()

    // 组件卸载时清理
    return () => {
      cancelAnimationFrame(loop)
      window.onresize = null
    }
  }, [maxFlake, flakeSize, fallSpeed])

  return (
    <canvas
      ref={canvasRef}
      id="snowfall"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}

export default Snowfall

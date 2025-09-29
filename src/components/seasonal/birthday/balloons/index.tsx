'use client'

import { m } from 'motion/react'
import { useEffect,useMemo, useState } from 'react'

import ballon1 from './ballon1.svg'
import ballon2 from './ballon2.svg'
import ballon3 from './ballon3.svg'

export default () => {
  const ballons = [ballon1, ballon2, ballon3]
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 生成随机的初始位置和动画参数
  const balloonConfigs = useMemo(() => {
    if (!isClient) return [] // 服务端返回空数组

    return new Array(12).fill(0).map((_, index) => {
      const randomX = Math.random() * 100 // 随机水平位置 0-100%
      const duration = 8 + Math.random() * 12 // 8-20秒的动画持续时间
      const delay = Math.random() * 10 // 0-10秒的延迟
      const balloonType = ballons[Math.floor(Math.random() * ballons.length)]

      return {
        id: index,
        balloonType,
        x: randomX,
        duration,
        delay,
      }
    })
  }, [isClient, ballons])

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {balloonConfigs.map((config) => (
        <m.img
          key={config.id}
          src={config.balloonType.src}
          className="absolute w-24 opacity-40"
          alt="balloon"
          initial={{
            x: `${config.x}vw`,
            y: '100vh', // 从屏幕底部开始
            rotate: 0,
            scale: 0.8,
          }}
          animate={{
            y: '-20vh', // 上升到屏幕顶部以上
            rotate: [-2, 2, -1, 1, 0], // 轻微摇摆
            scale: [0.8, 1, 0.9, 1, 0.95], // 轻微缩放变化
          }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 5, // 重复间隔
            rotate: {
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          }}
        />
      ))}
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

const RippleWaveLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(7)].map((_, index) => (
        <motion.div
          key={index}
          className="h-8 w-4 rounded-full bg-blue-500"
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            scaleX: [1, 1, 1],
            translateY: ['0%', '-15%', '0%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export default RippleWaveLoader
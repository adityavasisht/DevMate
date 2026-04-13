import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  subtitle?: string
  onClose: () => void
  duration?: number
}

const Toast = ({ message, subtitle, onClose, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">🎯</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{message}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
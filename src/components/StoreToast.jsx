import { useEffect } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useStore } from '../context/useStore.js'
import './StoreToast.css'

function StoreToast() {
  const { cartNotice, dismissCartNotice } = useStore()

  useEffect(() => {
    if (!cartNotice) return undefined

    const timeoutId = window.setTimeout(dismissCartNotice, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [cartNotice, dismissCartNotice])

  if (!cartNotice) return null

  return (
    <div className="store-toast" key={cartNotice.id} role="status">
      <span aria-hidden="true" className="store-toast__icon">
        <FaCheck />
      </span>
      <span>{cartNotice.message}</span>
      <button aria-label="Dismiss notification" onClick={dismissCartNotice} type="button">×</button>
    </div>
  )
}

export default StoreToast

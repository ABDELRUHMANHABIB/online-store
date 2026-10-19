import { useContext } from 'react'
import { StoreContext } from './store-context.js'

export function useStore() {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useStore must be used inside StoreProvider')
  }

  return store
}

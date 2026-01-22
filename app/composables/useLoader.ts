import { useState } from '#app'

export const useLoader = () => {
  const isLoading = useState<boolean>('is-loading', () => false)
  const loadingMessage = useState<string>('loading-message', () => 'CHARGEMENT...')

  const startLoading = (message: string = 'CHARGEMENT...') => {
    loadingMessage.value = message
    isLoading.value = true
  }

  const stopLoading = () => {
    isLoading.value = false
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  }
}
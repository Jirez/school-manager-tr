import configuration from '@/configuration'
import { useRequest } from 'ahooks'

const useRequestConfiguration = () => {
  function loadConfiguration() {
    return Promise.resolve({ data: configuration })
  }

  return useRequest(loadConfiguration)
}

export default useRequestConfiguration

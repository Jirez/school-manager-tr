import axios from 'axios'
import { useRequest } from 'ahooks'
import type { TConfiguration } from '@/utils/types'

const useRequestConfiguration = () => {
  function loadConfiguration() {
    return axios.get<TConfiguration>('/configuration.json')
  }

  return useRequest(loadConfiguration)
}

export default useRequestConfiguration

const DEFAULT_TEMPLATE_API_BASE_URL = 'http://set.fanpokka.ai:8067'
const TEMPLATE_API_PROXY_BASE_URL = '/template-api'

function getTemplateApiConfig() {
  const configuredBaseURL = window.endpoint?.templateApiBaseURL
  const baseURL = configuredBaseURL
    || (window.location.protocol === 'https:'
      ? TEMPLATE_API_PROXY_BASE_URL
      : DEFAULT_TEMPLATE_API_BASE_URL)
  const timeout = window.endpoint?.templateApiTimeout || 120000
  const normalizedBaseURL = baseURL.replace(/\/$/, '')

  return {
    baseURL: normalizedBaseURL,
    absoluteBaseURL: new URL(normalizedBaseURL, window.location.origin).href.replace(/\/$/, ''),
    upstreamBaseURL: DEFAULT_TEMPLATE_API_BASE_URL,
    timeout,
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 120000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

function getStatusHint(status) {
  const hints = {
    400: '圖片格式不支援或參數錯誤',
    404: '找不到指定模板，請確認後端模板名稱或 template id',
    502: '生圖服務回應錯誤，請稍後再試',
    504: '生圖逾時，請稍後再試',
  }

  return hints[status] || `HTTP ${status}`
}

async function readErrorMessage(response) {
  const fallback = getStatusHint(response.status)

  try {
    const data = await response.json()
    const detail = data.detail || data.error_message || data.message
    return detail ? `${fallback}：${detail}` : fallback
  } catch (error) {
    return `${fallback}: ${response.statusText}`
  }
}

function toAbsoluteUrl(config, url) {
  if (!url) return ''

  if (/^https?:\/\//i.test(url)) {
    const source = new URL(url)
    const configuredOrigin = new URL(config.absoluteBaseURL)
    const upstreamOrigin = new URL(config.upstreamBaseURL)

    if (source.origin === configuredOrigin.origin || (
      window.location.protocol === 'https:' && source.origin === upstreamOrigin.origin
    )) {
      return `${config.absoluteBaseURL}${source.pathname}${source.search}${source.hash}`
    }

    return url
  }

  return `${config.absoluteBaseURL}${url.startsWith('/') ? '' : '/'}${url}`
}

export const aliImageStudioService = {
  async getTemplates() {
    const config = getTemplateApiConfig()
    const response = await fetchWithTimeout(`${config.baseURL}/api/templates`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }, config.timeout)

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    return response.json()
  },

  async generateFromTemplate(templateId, imageFile) {
    const config = getTemplateApiConfig()
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetchWithTimeout(`${config.baseURL}/api/templates/${templateId}/generate`, {
      method: 'POST',
      body: formData,
    }, config.timeout)

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    const data = await response.json()

    if (data.status !== 'completed' || !data.outputs?.length) {
      throw new Error(data.error_message || '生圖未完成，請重新再試')
    }

    const outputUrl = toAbsoluteUrl(config, data.outputs[0].url)

    return {
      ...data,
      outputUrl,
    }
  },
}

const TEMPLATE_API_ORIGIN = 'http://nurse.5gao.ai:8067'

function getTemplateApiConfig() {
  const baseURL = window.endpoint?.templateApiBaseURL || 'http://localhost:8067'
  const timeout = window.endpoint?.templateApiTimeout || 120000

  return {
    baseURL: baseURL.replace(/\/$/, ''),
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

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    return data.detail || data.error_message || data.message || `HTTP ${response.status}`
  } catch (error) {
    return `HTTP ${response.status}: ${response.statusText}`
  }
}

function toAbsoluteUrl(baseURL, url) {
  if (!url) return ''

  if (/^https?:\/\//i.test(url)) {
    const source = new URL(url)
    const templateApiOrigin = new URL(TEMPLATE_API_ORIGIN)

    if (source.origin === templateApiOrigin.origin) {
      return `${baseURL}${source.pathname}${source.search}${source.hash}`
    }

    return url
  }

  return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`
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

    const outputUrl = toAbsoluteUrl(config.baseURL, data.outputs[0].url)

    return {
      ...data,
      outputUrl,
    }
  },
}

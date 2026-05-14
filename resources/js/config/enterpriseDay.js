import { imageUrls } from './imageUrls.js'

export const ENTERPRISE_GENDERS = [
  {
    id: 'male',
    name: '男生',
    defaultImage: imageUrls.enterprise.gender.male.default,
    selectedImage: imageUrls.enterprise.gender.male.selected,
  },
  {
    id: 'female',
    name: '女生',
    defaultImage: imageUrls.enterprise.gender.female.default,
    selectedImage: imageUrls.enterprise.gender.female.selected,
  },
]

export const ENTERPRISE_TEMPLATES = [
  {
    id: 'sanliTv',
    configKey: 'sanliTv',
    name: '三立電視台',
    images: imageUrls.enterprise.templates.sanliTv,
  },
  {
    id: 'chef',
    configKey: 'chef',
    name: '型男大主廚',
    images: imageUrls.enterprise.templates.chef,
  },
  {
    id: 'taiwanOpera',
    configKey: 'taiwanOpera',
    name: '戲說台灣',
    images: imageUrls.enterprise.templates.taiwanOpera,
  },
  {
    id: 'table',
    configKey: 'table',
    name: '請世界吃桌',
    images: imageUrls.enterprise.templates.table,
  },
]

const fallbackTemplateIds = {
  sanliTv: 1,
  chef: 2,
  taiwanOpera: 3,
  table: 4,
}

export function getEnterpriseTemplateApiId(templateId) {
  const template = ENTERPRISE_TEMPLATES.find((item) => item.id === templateId)
  const key = template?.configKey || templateId
  const configuredIds = window.endpoint?.enterpriseTemplateIds || {}

  return configuredIds[key] || fallbackTemplateIds[key] || fallbackTemplateIds.sanliTv
}

export function getEnterpriseTemplateName(templateId) {
  return ENTERPRISE_TEMPLATES.find((item) => item.id === templateId)?.name || ''
}

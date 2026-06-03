import { imageUrls } from './imageUrls.js'

export const ENTERPRISE_GENDERS = [
  {
    id: 'male',
    name: '男性',
    defaultImage: imageUrls.enterprise.gender.male.default,
    selectedImage: imageUrls.enterprise.gender.male.selected,
  },
  {
    id: 'female',
    name: '女性',
    defaultImage: imageUrls.enterprise.gender.female.default,
    selectedImage: imageUrls.enterprise.gender.female.selected,
  },
]

export const ENTERPRISE_TEMPLATES = [
  {
    id: 'sanliTv',
    configKey: 'sanliTv',
    name: '三立新聞台',
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
    visible: false,
    images: imageUrls.enterprise.templates.table,
  },
]

const fallbackTemplateIds = {
  chef: {
    female: 1,
    male: 2,
  },
  taiwanOpera: {
    female: 3,
    male: 4,
  },
  sanliTv: {
    female: 5,
    male: 6,
  },
  table: {
    female: 7,
    male: 8,
  },
}

export function getEnterpriseTemplateApiId(templateId, genderId = 'female') {
  const template = ENTERPRISE_TEMPLATES.find((item) => item.id === templateId)
  const key = template?.configKey || templateId
  const configuredIds = window.endpoint?.enterpriseTemplateIds || {}
  const normalizedGender = genderId === 'male' ? 'male' : 'female'
  const configuredTemplate = configuredIds[key]

  if (configuredTemplate && typeof configuredTemplate === 'object') {
    return configuredTemplate[normalizedGender]
      || fallbackTemplateIds[key]?.[normalizedGender]
      || fallbackTemplateIds.sanliTv[normalizedGender]
  }

  return fallbackTemplateIds[key]?.[normalizedGender] || fallbackTemplateIds.sanliTv[normalizedGender]
}

export function getEnterpriseTemplateName(templateId) {
  return ENTERPRISE_TEMPLATES.find((item) => item.id === templateId)?.name || ''
}

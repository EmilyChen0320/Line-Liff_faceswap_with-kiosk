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

export const ESG_FACE_SWAP_TEMPLATE_ID = 'battlefieldArt'

const genderKeywords = {
  female: ['女', 'female', 'girl', 'woman'],
  male: ['男', 'male', 'boy', 'man'],
}

function normalizeGender(genderId = 'female') {
  return genderId === 'male' ? 'male' : 'female'
}

function templateSearchText(template) {
  return [template?.name, template?.prompt, template?.inputs?.[0]?.original_name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function isTemplateForGender(template, genderId) {
  const searchText = templateSearchText(template)
  return genderKeywords[genderId].some((keyword) => searchText.includes(keyword.toLowerCase()))
}

export function getConfiguredEnterpriseTemplateApiId(
  templateId = ESG_FACE_SWAP_TEMPLATE_ID,
  genderId = 'female',
) {
  const configuredIds = window.endpoint?.enterpriseTemplateIds || {}
  const normalizedGender = normalizeGender(genderId)
  const configuredTemplate = configuredIds[templateId]

  if (configuredTemplate && typeof configuredTemplate === 'object') {
    return configuredTemplate[normalizedGender] || null
  }

  return null
}

export function findEnterpriseTemplateApiId(templates, genderId = 'female') {
  const normalizedGender = normalizeGender(genderId)
  const templateList = Array.isArray(templates) ? templates : []
  const genderMatches = templateList.filter((template) => isTemplateForGender(template, normalizedGender))
  const esgMatch = genderMatches.find((template) => templateSearchText(template).includes('esg'))
  const matchedTemplate = esgMatch || genderMatches[0]

  return matchedTemplate?.id || null
}

export function getEnterpriseTemplateName() {
  return '與戰地阿特合影'
}

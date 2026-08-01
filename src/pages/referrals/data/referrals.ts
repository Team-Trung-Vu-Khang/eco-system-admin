export type ReferralStatus = 'Hoạt động' | 'Khoá'

export type ReferralRow = {
  id: string
  phone: string
  fullName: string
  province: string
  status: ReferralStatus
  updatedAt: string
}

export type ReferralFormValues = {
  phone: string
  fullName: string
  province: string
  status: ReferralStatus
}

export type ReferralFormErrors = Partial<Record<keyof ReferralFormValues, string>>

export type ReferralUploadReviewRow = {
  id: string
  lineNumber: number
  phone: string
  fullName: string
  province: string
  action: 'Thêm mới' | 'Cập nhật' | 'Lỗi'
  valid: boolean
  reasons: string[]
}

export type ReferralUploadReview = {
  rows: ReferralUploadReviewRow[]
  validValues: ReferralFormValues[]
  successCount: number
  failCount: number
}

export const referralStatusOptions = [
  { label: 'Hoạt động', value: 'Hoạt động' },
  { label: 'Khoá', value: 'Khoá' },
]

export const referralStorageKey = 'eco-system-admin-referrals'

export const seedReferrals: ReferralRow[] = [
  {
    id: 'r-1',
    phone: '84901234567',
    fullName: 'Nguyễn Văn A',
    province: 'TP. Hồ Chí Minh',
    status: 'Hoạt động',
    updatedAt: '01/08/2026 08:10',
  },
  {
    id: 'r-2',
    phone: '84987654321',
    fullName: 'Trần Thị B',
    province: 'Hà Nội',
    status: 'Hoạt động',
    updatedAt: '01/08/2026 09:25',
  },
  {
    id: 'r-3',
    phone: '84881234567',
    fullName: 'Lê Văn C',
    province: 'Đồng Nai',
    status: 'Khoá',
    updatedAt: '31/07/2026 17:44',
  },
]

export const initialReferralFormValues: ReferralFormValues = {
  phone: '',
  fullName: '',
  province: '',
  status: 'Hoạt động',
}

export function normalizePhoneTo84(input: string) {
  const digits = input.replace(/\D/g, '')
  if (!digits) return ''

  let normalized = digits
  if (normalized.startsWith('00')) {
    normalized = normalized.replace(/^0+/, '')
  }

  if (normalized.startsWith('84')) {
    return normalized
  }

  if (normalized.startsWith('0')) {
    return `84${normalized.slice(1)}`
  }

  return `84${normalized}`
}

export function formatNow() {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function isUploadHeader(columns: string[]) {
  const header = columns.join(' ').toLowerCase()
  return (
    header.includes('phone') ||
    header.includes('sdt') ||
    header.includes('số điện thoại') ||
    header.includes('ten') ||
    header.includes('tên') ||
    header.includes('tinh') ||
    header.includes('tỉnh')
  )
}

export function reviewReferralUploadText(
  text: string,
  existingPhones: string[] = [],
): ReferralUploadReview {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (rows.length === 0) {
    return {
      rows: [],
      validValues: [],
      successCount: 0,
      failCount: 0,
    }
  }

  const reviewedRows: ReferralUploadReviewRow[] = []
  const validValues: ReferralFormValues[] = []
  const existingPhoneSet = new Set(existingPhones)
  const seenPhonesInFile = new Set<string>()

  for (const [index, row] of rows.entries()) {
    const columns = row
      .split(/[,\t;|]/)
      .map((cell) => cell.trim())
      .filter(Boolean)

    if (index === 0 && isUploadHeader(columns)) {
      continue
    }

    const reasons: string[] = []
    const rawPhone = columns[0] ?? ''
    const fullName = columns[1] ?? ''
    const province = columns[2] ?? ''
    const phone = normalizePhoneTo84(rawPhone)
    const isExisting = phone ? existingPhoneSet.has(phone) : false

    if (columns.length < 3) {
      reasons.push('Thiếu đủ 3 cột: số điện thoại, tên, tỉnh')
    }

    if (!rawPhone.trim()) {
      reasons.push('Thiếu số điện thoại')
    } else if (!phone || phone.length < 10) {
      reasons.push('Số điện thoại không hợp lệ')
    }

    if (!fullName.trim()) {
      reasons.push('Thiếu tên')
    }

    if (!province.trim()) {
      reasons.push('Thiếu tỉnh')
    }

    if (phone && seenPhonesInFile.has(phone)) {
      reasons.push('Số điện thoại bị trùng trong tệp')
    }

    const valid = reasons.length === 0
    if (valid) {
      seenPhonesInFile.add(phone)
      validValues.push({
        phone,
        fullName: fullName.trim(),
        province: province.trim(),
        status: 'Hoạt động',
      })
    }

    reviewedRows.push({
      id: `${index + 1}-${phone || 'invalid'}`,
      lineNumber: index + 1,
      phone,
      fullName: fullName.trim(),
      province: province.trim(),
      action: valid ? (isExisting ? 'Cập nhật' : 'Thêm mới') : 'Lỗi',
      valid,
      reasons,
    })
  }

  return {
    rows: reviewedRows,
    validValues,
    successCount: validValues.length,
    failCount: reviewedRows.length - validValues.length,
  }
}

export function parseReferralUploadText(text: string) {
  return reviewReferralUploadText(text).validValues
}

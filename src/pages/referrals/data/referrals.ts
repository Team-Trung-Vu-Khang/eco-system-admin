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

export function parseReferralUploadText(text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (rows.length === 0) return []

  const mappedRows: ReferralFormValues[] = []

  for (const [index, row] of rows.entries()) {
    const columns = row
      .split(/[,\t;|]/)
      .map((cell) => cell.trim())
      .filter(Boolean)

    if (index === 0) {
      const header = columns.join(' ').toLowerCase()
      if (
        header.includes('phone') ||
        header.includes('sdt') ||
        header.includes('số điện thoại') ||
        header.includes('ten') ||
        header.includes('tên')
      ) {
        continue
      }
    }

    if (columns.length < 3) continue

    mappedRows.push({
      phone: normalizePhoneTo84(columns[0]),
      fullName: columns[1],
      province: columns[2],
      status: 'Hoạt động',
    })
  }

  return mappedRows
}

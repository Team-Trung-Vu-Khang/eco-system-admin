import * as XLSX from "xlsx"
import type { ReferrerListItem } from "@/api/referrers/referrers.response"
import { getFeatureDuplicateMessage } from "@/constants/message.constant"

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
export const referralTemplateFileName = 'mau_danh_sach_nguoi_gioi_thieu.xlsx'

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
      reasons.push(`${getFeatureDuplicateMessage('referrers')} trong tệp`)
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

export function buildReferralTemplateWorkbook() {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Số điện thoại", "Họ và tên", "Tỉnh"],
    ["09012345678", "Nguyễn Văn A", "Hà Nội"],
  ])

  worksheet["!cols"] = [
    { wch: 18.13 },
    { wch: 18.88 },
    { wch: 17.88 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trang tính1")

  return workbook
}

export async function parseReferralUploadFile(file: File) {
  const isExcelFile = /\.(xlsx|xls)$/i.test(file.name)

  if (!isExcelFile) {
    return file.text()
  }

  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    return ""
  }

  const worksheet = workbook.Sheets[firstSheetName]
  return XLSX.utils.sheet_to_csv(worksheet)
}

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

export function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function normalizeReferralStatus(value: string): ReferralStatus {
  return value.toLowerCase().includes("hoạt động") || value.toLowerCase().includes("active")
    ? "Hoạt động"
    : "Khoá"
}

export function mapReferrerToReferralRow(item: ReferrerListItem): ReferralRow {
  return {
    id: String(item.id),
    phone: item.username,
    fullName: item.fullName,
    province: item.operatingArea,
    status: normalizeReferralStatus(item.status),
    updatedAt: formatDateTime(item.createdAt),
  }
}

import { useEffect, useState } from 'react'
import {
  formatNow,
  initialReferralFormValues,
  normalizePhoneTo84,
  referralStorageKey,
  seedReferrals,
  type ReferralFormValues,
  type ReferralStatus,
  type ReferralRow,
} from '../data/referrals'

const validReferralStatuses: ReferralStatus[] = ['Hoạt động', 'Khoá']

function readReferrals() {
  if (typeof window === 'undefined') return seedReferrals

  const raw = window.localStorage.getItem(referralStorageKey)
  if (!raw) return seedReferrals

  try {
    const parsed = JSON.parse(raw) as ReferralRow[]
    if (!Array.isArray(parsed) || parsed.length === 0) return seedReferrals

    return parsed.map((referral) => ({
      id: referral.id,
      phone: referral.phone,
      fullName: referral.fullName,
      province: referral.province,
      commune: referral.commune ?? "",
      status: validReferralStatuses.includes(referral.status as ReferralStatus)
        ? (referral.status as ReferralStatus)
        : 'Hoạt động',
      updatedAt: referral.updatedAt,
    }))
  } catch {
    return seedReferrals
  }
}

export function buildReferralFormValues(referral?: ReferralRow | null): ReferralFormValues {
  if (!referral) return initialReferralFormValues

  return {
    phone: referral.phone,
    fullName: referral.fullName,
    province: referral.province,
    commune: referral.commune ?? "",
    status: referral.status,
  }
}

export function useReferralsStore() {
  const [referrals, setReferrals] = useState<ReferralRow[]>(() => readReferrals())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(referralStorageKey, JSON.stringify(referrals))
    }
  }, [referrals])

  const getReferralByPhone = (phone: string) => {
    const normalizedPhone = normalizePhoneTo84(phone)
    return referrals.find((referral) => referral.phone === normalizedPhone) ?? null
  }

  const getReferralById = (id: string) => {
    return referrals.find((referral) => referral.id === id) ?? null
  }

  const createReferral = (values: ReferralFormValues) => {
    const normalizedPhone = normalizePhoneTo84(values.phone)
    const nextReferral: ReferralRow = {
      id: `r-${Date.now()}`,
      phone: normalizedPhone,
      fullName: values.fullName.trim(),
      province: values.province.trim(),
      commune: values.commune?.trim() ?? "",
      status: values.status,
      updatedAt: formatNow(),
    }

    setReferrals((current) => [nextReferral, ...current])
    return nextReferral
  }

  const updateReferral = (id: string, values: ReferralFormValues) => {
    const normalizedPhone = normalizePhoneTo84(values.phone)

    setReferrals((current) =>
      current.map((referral) =>
        referral.id === id
          ? {
              ...referral,
              phone: normalizedPhone,
              fullName: values.fullName.trim(),
              province: values.province.trim(),
              commune: values.commune?.trim() ?? "",
              status: values.status,
              updatedAt: formatNow(),
            }
          : referral,
      ),
    )
  }

  const deleteReferral = (id: string) => {
    setReferrals((current) => current.filter((referral) => referral.id !== id))
  }

  const upsertManyReferrals = (values: ReferralFormValues[]) => {
    setReferrals((current) => {
      const next = [...current]

      for (const value of values) {
        const normalizedPhone = normalizePhoneTo84(value.phone)
        if (!normalizedPhone) continue

        const existingIndex = next.findIndex((item) => item.phone === normalizedPhone)
        const nextReferral: ReferralRow = {
          id: existingIndex >= 0 ? next[existingIndex].id : `r-${Date.now()}-${normalizedPhone}`,
          phone: normalizedPhone,
          fullName: value.fullName.trim(),
          province: value.province.trim(),
          commune: value.commune?.trim() ?? "",
          status: value.status || 'Hoạt động',
          updatedAt: formatNow(),
        }

        if (existingIndex >= 0) {
          next[existingIndex] = nextReferral
        } else {
          next.unshift(nextReferral)
        }
      }

      return next
    })
  }

  return {
    referrals,
    getReferralByPhone,
    getReferralById,
    createReferral,
    updateReferral,
    deleteReferral,
    upsertManyReferrals,
  }
}

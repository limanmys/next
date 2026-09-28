import { isAxiosError } from "axios"
import { TFunction } from "i18next"

import { ISshHostKeyChallenge } from "@/types/server"

export function isSshHostKeyChallenge(
  value: unknown
): value is ISshHostKeyChallenge {
  if (typeof value !== "object" || value === null) return false
  const challenge = value as Partial<ISshHostKeyChallenge>
  return (
    (challenge.code === "SSH_HOST_KEY_UNKNOWN" ||
      challenge.code === "SSH_HOST_KEY_MISMATCH") &&
    typeof challenge.host === "string" &&
    typeof challenge.port === "number" &&
    typeof challenge.key_type === "string" &&
    typeof challenge.fingerprint === "string" &&
    Array.isArray(challenge.trusted_fingerprints) &&
    challenge.trusted_fingerprints.every(
      (fingerprint) => typeof fingerprint === "string"
    )
  )
}

export function sshErrorMessage(error: unknown, t: TFunction): string {
  if (isAxiosError<{ code?: string }>(error)) {
    const code = error.response?.data?.code
    if (
      code &&
      t(`servers.actions.ssh_host_key.errors.${code}`, { defaultValue: "" })
    ) {
      return t(`servers.actions.ssh_host_key.errors.${code}`)
    }
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return t("servers.actions.ssh_host_key.errors.SSH_CONNECTION_TIMEOUT")
    }
    if (!error.response) return t("servers.actions.ssh_host_key.network_error")
    if (error.response.status === 403)
      return t("servers.actions.ssh_host_key.permission")
    if (error.response.status === 404)
      return t("servers.actions.ssh_host_key.not_found")
  }
  return t("servers.actions.ssh_host_key.error")
}

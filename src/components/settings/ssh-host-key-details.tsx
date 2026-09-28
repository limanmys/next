import { useTranslation } from "react-i18next"

import { ISshHostKeyChallenge, ISshHostKeyStatus } from "@/types/server"

export function SshHostKeyDetails({
  hostKey,
}: {
  hostKey: ISshHostKeyChallenge | ISshHostKeyStatus
}) {
  const { t } = useTranslation("settings")
  const fingerprints =
    "trusted_fingerprints" in hostKey ? hostKey.trusted_fingerprints : []
  return (
    <dl className="space-y-2 rounded-md border bg-muted p-3 text-sm">
      <dt>{t("servers.actions.ssh_host_key.endpoint")}</dt>
      <dd dir="ltr" className="break-all font-mono text-xs">
        {hostKey.host} : {hostKey.port}
      </dd>
      <dt>{t("servers.actions.ssh_host_key.key_type")}</dt>
      <dd className="font-mono text-xs">{hostKey.key_type}</dd>
      <dt>{t("servers.actions.ssh_host_key.current_fingerprint")}</dt>
      <dd dir="ltr" className="break-all font-mono text-xs">
        {hostKey.fingerprint}
      </dd>
      {fingerprints.length > 0 && (
        <>
          <dt>{t("servers.actions.ssh_host_key.trusted_fingerprints")}</dt>
          <dd dir="ltr" className="space-y-1 break-all font-mono text-xs">
            {fingerprints.map((fingerprint) => (
              <div key={fingerprint}>{fingerprint}</div>
            ))}
          </dd>
        </>
      )}
    </dl>
  )
}

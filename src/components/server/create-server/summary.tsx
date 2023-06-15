import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

import { readableKeyType } from "./key"

export default function Summary({ data }: { data: any }) {
  return (
    <div className="space-y-8 divide-y divide-foreground/10 sm:space-y-5">
      <div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-foreground">
            Özet
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            Seçimlerinizi kontrol edin ve onaylayın.
          </p>
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">Sunucu Adı</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.name}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">Sunucu Adresi</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.ip_address}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">İşletim Sistemi</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          {data.os_type === "linux" ? (
            <div className="flex items-center gap-2">
              <Icons.linux className="h-4 w-4" />
              GNU/Linux
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Icons.windows className="h-4 w-4" />
              Windows
            </div>
          )}
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">Sunucu Portu</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.port}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">Anahtar Türü</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          {readableKeyType(data.key_type)}
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">Anahtar Paylaşımı</Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          {data.shared === "true" ? "Evet" : "Hayır"}
        </div>
      </div>
    </div>
  )
}

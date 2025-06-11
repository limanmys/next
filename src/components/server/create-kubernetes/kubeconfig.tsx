import { zodResolver } from "@hookform/resolvers/zod"
import { File, Type, Upload } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormMessage
} from "@/components/form/form"
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/dropzone"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    kubeconfig: z.string().min(1, "Kubeconfig içeriği zorunludur"),
})

interface KubernetesConnectionProps {
    formRef: any
    data: any
}

export default function KubernetesConnection({
    formRef,
    data,
}: KubernetesConnectionProps) {
    const { t } = useTranslation("servers")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [activeTab, setActiveTab] = useState<"file" | "text">("file")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kubeconfig: data?.kubeconfig || "",
        },
        mode: "onChange",
    })
    formRef.current = form

    const handleFileSelect = (files: File[] | null) => {
        if (files && files.length > 0) {
            const file = files[0]
            setSelectedFile(file)

            // Read file content
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                form.setValue("kubeconfig", content)
                // Trigger validation after setting the value
                form.trigger("kubeconfig")
            }
            reader.onerror = () => {
                // Handle file reading error
                form.setError("kubeconfig", {
                    type: "manual",
                    message: "Dosya okunamadı. Lütfen geçerli bir kubeconfig dosyası seçin."
                })
                setSelectedFile(null)
            }
            reader.readAsText(file)
        } else {
            setSelectedFile(null)
            if (activeTab === "file") {
                form.setValue("kubeconfig", "")
            }
        }
    }

    const handleTabChange = (value: string) => {
        const newTab = value as "file" | "text"
        setActiveTab(newTab)

        // If switching to file mode and no file is selected, clear the form
        if (newTab === "file" && !selectedFile) {
            form.setValue("kubeconfig", "")
        }
    }

    const switchToManualInput = () => {
        setActiveTab("text")
        setSelectedFile(null)
        // Keep the current kubeconfig content when switching to manual
    }

    return (
        <div className="space-y-8 divide-y divide-foreground/10 sm:space-y-5">
            <div>
                <div>
                    <h3 className="text-lg font-medium leading-6 text-foreground">
                        {t("create_kubernetes.connection.kubeconfig.title")}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-foreground/60">
                        {t("create_kubernetes.connection.kubeconfig.description")}
                    </p>
                </div>
                <Form {...form}>
                    <form>
                        <FormField
                            control={form.control}
                            name="kubeconfig"
                            render={({ field }: { field: any }) => (
                                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                                        <Label htmlFor="kubeconfig" className="sm:mt-px sm:pt-2">
                                            {t("create_kubernetes.connection.kubeconfig.label")}
                                        </Label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <FormControl>
                                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="file" className="flex items-center gap-2">
                                                            <Upload className="size-4" />
                                                            {t("create_kubernetes.connection.kubeconfig.file_upload")}
                                                        </TabsTrigger>
                                                        <TabsTrigger value="text" className="flex items-center gap-2">
                                                            <Type className="size-4" />
                                                            {t("create_kubernetes.connection.kubeconfig.manual_input")}
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="file" className="space-y-4 mt-4">
                                                        <FileUploader
                                                            value={selectedFile ? [selectedFile] : null}
                                                            onValueChange={handleFileSelect}
                                                            dropzoneOptions={{
                                                                accept: {
                                                                    "text/*": [".yaml", ".yml", ".txt"],
                                                                    "application/x-yaml": [".yaml", ".yml"],
                                                                },
                                                                maxFiles: 1,
                                                                maxSize: 5 * 1024 * 1024, // 5MB
                                                                multiple: false,
                                                            }}
                                                            className="relative bg-background"
                                                        >
                                                            <FileInput className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                                                                <div className="flex w-full flex-col items-center justify-center py-12 px-6">
                                                                    <Upload className="size-10 text-muted-foreground mb-4" />
                                                                    <p className="mb-2 text-sm font-semibold text-center">
                                                                        {t("create_kubernetes.connection.kubeconfig.drag_drop_text")}{" "}
                                                                        <span className="text-primary">{t("create_kubernetes.connection.kubeconfig.click_to_select")}</span>
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground text-center">
                                                                        {t("create_kubernetes.connection.kubeconfig.supported_formats")}
                                                                    </p>
                                                                </div>
                                                            </FileInput>
                                                            <FileUploaderContent>
                                                                {selectedFile && (
                                                                    <FileUploaderItem index={0} className="flex items-center py-3">
                                                                        <File className="size-4 stroke-current mr-2" />
                                                                        <span className="text-sm">{selectedFile.name}</span>
                                                                    </FileUploaderItem>
                                                                )}
                                                            </FileUploaderContent>
                                                        </FileUploader>
                                                    </TabsContent>

                                                    <TabsContent value="text" className="mt-4">
                                                        <Textarea
                                                            placeholder={t("create_kubernetes.connection.kubeconfig.placeholder")}
                                                            className="min-h-[300px] font-mono text-sm"
                                                            {...field}
                                                        />
                                                    </TabsContent>
                                                </Tabs>
                                            </FormControl>
                                            <p className="mt-2 text-sm text-foreground/60">
                                                {t("create_kubernetes.connection.kubeconfig.description")}
                                            </p>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}

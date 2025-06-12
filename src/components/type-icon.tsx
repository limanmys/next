import { ShieldQuestionIcon } from "lucide-react";
import { Icons } from "./ui/icons";

export default function TypeIcon({ type, ...props }: { type: string, [key: string]: any }) {
    switch (type) {
        case "linux":
            return <Icons.linux {...props} />
        case "windows":
            return <Icons.windows {...props} />
        case "kubernetes":
            return <Icons.kubernetes {...props} />
        default:
            return <ShieldQuestionIcon {...props} />
    }
}
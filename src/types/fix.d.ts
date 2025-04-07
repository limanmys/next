import "@radix-ui/react-alert-dialog"
import "@radix-ui/react-dialog"

declare module "@radix-ui/react-dialog" {
  export interface DialogPortalProps {
    className?: string
  }
}

declare module "@radix-ui/react-alert-dialog" {
  export interface AlertDialogPortalProps {
    className?: string
  }
}

export {}

declare global {
  interface Window {
    Pusher: any
    $setAuthDialog: any
  }
}

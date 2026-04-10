import { toast } from "react-toastify"

export const handleShare = async (url: string) => {
    if (!url) return
    const shareUrl = `${window.location.origin}/${url}`;

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy link. Please try again.")
    }
}
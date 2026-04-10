import { toast } from "react-toastify"

/**
 * Copies a shareable URL to the clipboard.
 * Constructs a full URL from the origin and the provided path.
 * @param url - The relative URL path to share
 */
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
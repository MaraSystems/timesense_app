import { useState, type SetStateAction } from "react"
import { Button } from "./Button"

interface DeleteParams {
    title?: string
    entityName?: string
    handleDelete: (f: (flag: SetStateAction<boolean>) => void) => void
    setShowDeleteConfirm: (flag: SetStateAction<boolean>) => void
}

/**
 * Delete confirmation modal component.
 * Displays a confirmation dialog before deleting an entity.
 * @param title - The title of the entity to delete
 * @param entityName - The type of entity (defaults to "Calendar")
 * @param handleDelete - Handler function for deletion, receives a loading state setter
 * @param setShowDeleteConfirm - State setter to close the modal
 */
export function Delete(params: DeleteParams) {
    const [isDeleting, setIsDeleting] = useState(false)
    const entityName = params.entityName || "Calendar"

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Delete {entityName}</h2>
            <p className="text-[#6B7280] mb-6">
              Are you sure you want to delete "{params?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => params.setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FF4D4F] hover:bg-[#FF4D4F]/80"
                onClick={() => {params.handleDelete(setIsDeleting)}}
                isLoading={isDeleting}
                data-testid="confirm-delete-button"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
    )
}
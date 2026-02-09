'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SurveyResponseDeleteDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onDelete: () => void
}

export function SurveyResponseDeleteDialog({
  open,
  setOpen,
  onDelete,
}: SurveyResponseDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            This action cannot be undone. This will permanently delete this survey response
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-900 dark:text-gray-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

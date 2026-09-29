import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/lib/types/types";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  feedback: Feedback | null;
};

export function FeedbackViewDialog({ open, setOpen, feedback }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg text-black max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-accent">Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong> {feedback?.name}
          </p>
          {feedback?.title && (
            <p>
              <strong>Package:</strong> {feedback.title}
            </p>
          )}
          <p>
            <strong>Rating:</strong> {"⭐".repeat(feedback?.rating ?? 0)}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {feedback?.is_approved ? "Approved" : "Pending"}
          </p>
          <div>
            <p className="font-semibold">Message</p>
            <p className="whitespace-pre-wrap">{feedback?.message}</p>
          </div>
          {feedback?.improvement && (
            <div>
              <p className="font-semibold">What could we improve? (private)</p>
              <p className="whitespace-pre-wrap">{feedback.improvement}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

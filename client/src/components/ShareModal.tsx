import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: {
    base: string;
    toppings: string[];
    sweetness: number;
    iceLevel: number;
  };
}

export function ShareModal({ open, onOpenChange, recipe }: ShareModalProps) {
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/recipe?${new URLSearchParams({
    base: recipe.base,
    toppings: recipe.toppings.join(","),
    sweetness: recipe.sweetness.toString(),
    iceLevel: recipe.iceLevel.toString(),
  })}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Recipe link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your creation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground break-all">
            {shareUrl}
          </p>
          <Button onClick={copyToClipboard} className="w-full">
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

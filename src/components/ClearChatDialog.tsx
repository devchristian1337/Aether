import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ClearChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearChatDialog({
  open,
  onClose,
  onConfirm,
}: ClearChatDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Clear Chat</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to clear all messages? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Clear All
        </Button>
      </DialogActions>
    </Dialog>
  );
}

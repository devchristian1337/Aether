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
    <Dialog
      open={open}
      onClose={onClose}
      role="alertdialog"
      aria-labelledby="clear-chat-title"
      aria-describedby="clear-chat-description"
    >
      <DialogTitle id="clear-chat-title">Clear Chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="clear-chat-description">
          Are you sure you want to clear all messages? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel clearing chat" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          aria-label="Confirm clearing all chat messages"
        >
          Clear All
        </Button>
      </DialogActions>
    </Dialog>
  );
}

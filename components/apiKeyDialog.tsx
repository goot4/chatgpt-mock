import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


type Props={
  submitCallback: (newKey:string)=>void
}
export default function FormDialog({submitCallback}:Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        设置Open Router Key
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const apiKey = formJson.apiKey;
            console.log(apiKey);

            submitCallback(apiKey)

            handleClose();
          },
        }}
      >
        <DialogTitle>设置Open Router API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            为了使用聊天功能, 您必须提供Open Router API Key. 您可以自行注册open router账号并获取免费的api key.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="apiKey"
            label="api key"
            type="apiKey"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button type="submit">确定</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

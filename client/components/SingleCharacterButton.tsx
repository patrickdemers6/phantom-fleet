import { Button, ButtonProps } from '@mui/material';

type SingleCharacterButtonProps = ButtonProps & { character: string };

function SingleCharacterButton({
  character,
  sx,
  ...props
}: SingleCharacterButtonProps) {
  return (
    <Button
      sx={{
        width: (theme) => theme.spacing(6),
        height: (theme) => theme.spacing(6),
        borderRadius: '50%',
        padding: 0,
        minWidth: 0,
        ...(sx ?? {}),
      }}
      {...props}
    >
      {character}
    </Button>
  );
}

export default SingleCharacterButton;

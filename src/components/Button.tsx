import { PlusIcon } from "@radix-ui/react-icons";
import { styled } from "../stitches.config";

export const Button = styled("button", {
  fontSize: "$4",
  padding: "8px 16px",
  backgroundColor: "$blue10",
  color: "$whiteA12",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  '&:hover': {
    backgroundColor: "#ddd",
  },
  '&[disabled]': {
    backgroundColor: "#ddd",
  },
  variants: {
    round: {
      true: {
        aspectRatio: 1,
        borderRadius: "50%",
        padding: "12px"
      }
    },
    cell: {
      true: {
        color: "$gray12",
        textTransform: "uppercase",
        fontSize: "$2",
        padding: "16px 8px",
        width: "100%",
        backgroundColor: "transparent",
        display: "flex",
        borderTop: "1px solid $gray6",
        borderBottom: "1px solid $gray6",
        borderRadius: 0,
        boxSizing: "border-box",
        alignItems: "center",
      },
    },
    chill: {
      true: {
        backgroundColor: "transparent",
        color: "$blue10",
      }
    },
    link: {
      true: {
        backgroundColor: "transparent",
        color: "$blue10",
        fontSize: "$1",
        display: "inline",
        padding: "0px 4px"
      }
    }

  }
})

export function PlusButton({ onClick }: {
  onClick?: () => void
}) {
  return <Button round onClick={onClick} ><PlusIcon width={20} height={20} stroke="white" strokeWidth={1} /></Button>
}

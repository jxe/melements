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
      },
    },
    chill: {
      true: {
        backgroundColor: "transparent",
        color: "$blue10",
      }
    }
  }
})

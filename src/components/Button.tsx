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
    chill: {
      true: {
        backgroundColor: "transparent",
        color: "$blue10",
      }
    }
  }
})

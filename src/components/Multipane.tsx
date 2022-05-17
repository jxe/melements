import { ReactNode, useContext, createContext } from "react";
import { styled, keyframes } from '@stitches/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { StyledOverlay } from "./Dialog";

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledMultipane = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  zIndex: 1001,
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  display: 'grid',
  overflow: "hidden",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  height: '100vh',
  maxWidth: '450px',
  maxHeight: '600px',
  // minHeight: '85vh',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
});

const StyledPane = styled('div', {
  maxHeight: 'inherit',
  gridColumn: 1,
  gridRow: 1,
  display: "flex",
  flexDirection: "column",
  transition: 'transform .2s ease-in-out',
  transform: 'translateX(0)',
  '&.inactive': {
    transform: 'translateX(-100%)',
  },
  '&.active + &.inactive': {
    transform: 'translateX(100%)',
  },
})

export const PaneBody = styled("div", {
  flex: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  overflowY: "auto",
})

const MultipaneContext = createContext<{ active: string | null }>({ active: null })

export function Root({ children, active }: { children: ReactNode, active: string | null }) {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledMultipane>
        <MultipaneContext.Provider value={{ active }}>
          {children}
        </MultipaneContext.Provider>
      </StyledMultipane>
    </DialogPrimitive.Portal>
  )
}

export function Pane({ children, id }: { children: ReactNode, id: string }) {
  const { active } = useContext(MultipaneContext)
  return <StyledPane className={`${active === id ? 'active' : 'inactive'}`}>
    {children}
  </StyledPane>
}

const StyledTop = styled('div', {
  position: 'relative',
  display: "grid",
  gridTemplateColumns: "1fr",
  alignItems: "center",
  justifyItems: "center",
  minHeight: "50px",

  '& > *:first-child': {
    position: 'absolute',
    left: "12px",
  },
  '& > *:last-child': {
    position: 'absolute',
    right: "8px",
  },

  "& main": {
    fontWeight: "600",
    textAlign: "center",
    fontSize: "22px",
  }
})

export function Top({ children, lButton, rButton }: { children: ReactNode, lButton?: ReactNode, rButton?: ReactNode }) {
  return <StyledTop>
    {lButton || <div />}
    <main>{children}</main>
    {rButton || <div />}
  </StyledTop>
}

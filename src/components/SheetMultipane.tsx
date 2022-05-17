import { ReactNode, useContext, createContext } from "react";
import { styled, keyframes } from '@stitches/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { StyledOverlay } from "./Dialog";

const slideIn = keyframes({
  from: { transform: '$$transformValue' },
  to: { transform: 'translate3d(0,0,0)' },
});

const slideOut = keyframes({
  from: { transform: 'translate3d(0,0,0)' },
  to: { transform: '$$transformValue' },
});


type SheetProps = React.ComponentProps<typeof DialogPrimitive.Root>;

export function Sheet({ children, ...props }: SheetProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </DialogPrimitive.Root>
  );
}


const StyledMultipane = styled(DialogPrimitive.Content, {
  backgroundColor: '$panel',
  boxShadow: '$colors$shadowLight 0 0 38px -10px, $colors$shadowDark 0 0 35px -15px',
  position: 'fixed',
  zIndex: '1001',
  inset: 0,
  width: 250,
  display: 'grid',
  overflow: "hidden",

  // Among other things, prevents text alignment inconsistencies when dialog can't be centered in the viewport evenly.
  // Affects animated and non-animated dialogs alike.
  willChange: 'transform',

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  '&[data-state="closed"]': {
    animation: `${slideOut} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  variants: {
    side: {
      bottom: {
        $$transformValue: 'translate3d(0,100%,0)',
        width: '100%',
        height: 300,
        bottom: 0,
        top: 'auto',
      },
      tallBottom: {
        $$transformValue: 'translate3d(0,100%,0)',
        width: '100%',
        height: "80%",
        bottom: 0,
        top: 'auto',
      },
    },
  },
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

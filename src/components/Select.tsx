import { violet, mauve, blackA } from '@radix-ui/colors';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ReactNode } from 'react';
import { styled } from '../stitches.config';

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  // borderRadius: 4,
  // padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  gap: 5,
  backgroundColor: 'white',
  color: "--var(--blue-text)",
  // boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': { backgroundColor: mauve.mauve3 },
  '&:focus': { boxShadow: `0 0 0 2px black` },
  variants: {
    filter: {
      true: {
        height: 25,
        display: "flex",
        borderRadius: "$pill",
        boxShadow: "none",
        backgroundColor: "$gray2",
        border: "solid 0.5px",
        borderColor: "$gray9",
        boxSizing: "border-box",
        justifyContent: "space-between",
        // width: "100%",
      }
    }
  }
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&:focus': {
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
});

const StyledLabel = styled(SelectPrimitive.Label, {
  padding: '0 25px',
  fontSize: 12,
  lineHeight: '25px',
  color: mauve.mauve11,
});

const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: violet.violet11,
  cursor: 'default',
};

const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);

const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);

const StyledValueContainer = styled('span', {
  variants: {
    variant: {
      placeholder: {
        color: mauve.mauve11,
      },
      tag: {
        borderRadius: "$2",
        backgroundColor: "$gray8",
        color: "black",
        padding: "2px 8px",
      }
    }
  }
})

const StyledValue = (props: any) => <StyledValueContainer {...props}><SelectPrimitive.Value /></StyledValueContainer>

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = StyledValue;
// export const SelectIcon = SelectPrimitive.Icon;
// export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
// export const SelectItemText = SelectPrimitive.ItemText;
// export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectSeparator = StyledSeparator;

export function SelectScrollUpButton() {
  return <StyledScrollUpButton>
    <ChevronUpIcon />
  </StyledScrollUpButton>
}

export function SelectScrollDownButton() {
  return <StyledScrollDownButton>
    <ChevronDownIcon />
  </StyledScrollDownButton>
}

export function SelectItem({ value, children }: { value: string, children: ReactNode }) {
  return <StyledItem value={value}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <StyledItemIndicator>
      <CheckIcon />
    </StyledItemIndicator>
  </StyledItem>
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <StyledContent>
    <SelectScrollUpButton />
    <StyledViewport>
      {children}
    </StyledViewport>
    <SelectScrollDownButton />
  </StyledContent>
}

export function SelectIcon() {
  return <SelectPrimitive.Icon>
    <ChevronDownIcon />
  </SelectPrimitive.Icon>
}
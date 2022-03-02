import React, { useState } from 'react';
import { styled, CSS, VariantProps } from '../stitches.config';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  boxSizing: 'border-box',
  userSelect: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },

  alignItems: 'center',
  appearance: 'none',
  display: 'inline-flex',
  justifyContent: 'center',
  lineHeight: '1',
  margin: '0',
  outline: 'none',
  padding: '0',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',

  color: '$hiContrast',
  // boxShadow: 'inset 0 0 0 1px $colors$slate7',
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px $colors$slate8',
  '&:focus': {
    outline: 'none',
    borderColor: '$red7',
    boxShadow: 'inset 0 0 0 1px $colors$blue9, 0 0 0 1px $colors$blue9',
  },

  variants: {
    size: {
      '1': {
        width: '$3',
        height: '$3',
        borderRadius: '$1',
      },
      '2': {
        width: '$5',
        height: '$5',
        borderRadius: '$2',
      },
    },
  },
  defaultVariants: {
    size: '1',
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  alignItems: 'center',
  display: 'flex',
  height: '125%',
  justifyContent: 'center',
  width: '125%',
  color: "#666"
});

export const CheckboxLabel = styled('label', {
  padding: "12px 8px",
  gap: "8px",
  display: 'flex',
  justifyContent: "flex-start",
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
  flex: "auto",
  textAlign: "left",
  backgroundColor: 'white',
  variants: {
    flush: {
      true: {
        padding: "8px 0",
        color: "$gray10"
      }
    }
  }
});

type CheckboxPrimitiveProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;
type CheckboxVariants = VariantProps<typeof StyledCheckbox>;
type CheckboxProps = CheckboxPrimitiveProps & CheckboxVariants & { css?: CSS };

export const Checkbox = React.forwardRef<React.ElementRef<typeof StyledCheckbox>, CheckboxProps>(
  (props, forwardedRef) => (
    <StyledCheckbox {...props} ref={forwardedRef}>
      <StyledIndicator>
        {props.checked === 'indeterminate' ?
          <DividerHorizontalIcon height={20} width={20} /> :
          <CheckIcon height={20} width={20} />
        }
      </StyledIndicator>
    </StyledCheckbox>
  )
);

export const AsyncCheckbox = React.forwardRef<React.ElementRef<typeof StyledCheckbox>, Omit<CheckboxProps, 'onCheckedChange'> & { onCheckedChange: (b: boolean) => Promise<void> }>(
  (props, forwardedRef) => {
    const [loading, setLoading] = useState(false);
    return (
      <StyledCheckbox {...props} ref={forwardedRef} onCheckedChange={(b) => {
        setLoading(true);
        props.onCheckedChange(!!b).then(() => setLoading(false));
      }}>
        <StyledIndicator>
          {loading ?
            <DividerHorizontalIcon height={20} width={20} /> :
            <CheckIcon height={20} width={20} />
          }
        </StyledIndicator>
      </StyledCheckbox>
    )
  }
);

const List = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  backgroundColor: '#ddd',
})

export function CheckboxList({
  options,
  selected,
  onChange,
}: {
  options: string[],
  selected: string[],
  onChange: (selected: string[]) => void,
}) {
  return (
    <List>
      {
        options.map(option => (
          <CheckboxLabel htmlFor={option}>
            <Checkbox
              id={option}
              onCheckedChange={checked => {
                if (checked) {
                  onChange([...selected, option]);
                } else {
                  onChange(selected.filter(s => s !== option))
                }
              }}
              checked={selected.includes(option)}
            />
            {option}
          </CheckboxLabel>
        ))
      }
    </List>
  )
}

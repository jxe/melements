import React from 'react';
import { styled, CSS } from '../stitches.config';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Separator } from './Separator';

export const Tabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
  },
});

export const TabsTrigger = styled(TabsPrimitive.Trigger, {
  flexShrink: 0,
  height: '$6',
  display: 'inline-flex',
  lineHeight: 1,
  fontSize: '$3',
  px: '$2',
  userSelect: 'none',
  outline: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$slate11',
  border: '1px solid transparent',
  background: "rgb(233, 233, 237)",
  // borderTopLeftRadius: '$2',
  // borderTopRightRadius: '$2',
  zIndex: '10',
  cursor: 'pointer',

  '@hover': {
    '&:hover': {
      color: '$hiContrast',
    },
  },

  '&[data-state="active"]': {
    color: '$hiContrast',
    // borderColor: '$slate6',
    borderBottomColor: 'black',
  },

  '&[disabled]': {
    color: '#777',
    cursor: 'not-allowed',
  },


  '&[data-orientation="vertical"]': {
    justifyContent: 'flex-start',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '$2',
    borderBottomColor: 'transparent',

    '&[data-state="active"]': {
      borderBottomColor: '$slate6',
      borderRightColor: 'transparent',
    },
  },
});

const StyledTabsList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
  overflowX: 'auto',
  background: "rgb(233, 233, 237)",
  // boxShadow: 'rgb(0 0 0 / 41%) 0px 1px 1px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px $slate8, 0 0 0 1px $slate8',
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    boxShadow: 'inset -1px 0 0 $slate6',
  },
});

type TabsListPrimitiveProps = React.ComponentProps<typeof TabsPrimitive.List>;
type TabsListProps = TabsListPrimitiveProps & { css?: CSS };

export const TabsList = React.forwardRef<React.ElementRef<typeof StyledTabsList>, TabsListProps>(
  (props, forwardedRef) => (
    <>
      <StyledTabsList {...props} ref={forwardedRef} />
      <Separator />
    </>
  )
);

export const TabsContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px $slate8, 0 0 0 1px $slate8',
  },
});
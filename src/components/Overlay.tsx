import { styled, css } from '../stitches.config';

export const overlayStyles = css({
  backgroundColor: 'rgba(0, 0, 0, .15)',
  zIndex: '99',
});

export const Overlay = styled('div', overlayStyles)

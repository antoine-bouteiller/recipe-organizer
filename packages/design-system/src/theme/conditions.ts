export const conditions = {
  dark: '.dark &',
  disabled: '&[data-disabled], &:disabled',
  endingStyle: '&[data-ending-style]',
  horizontal: '&[data-orientation=horizontal]',
  hover: ['@media (hover: hover) and (pointer: fine)', '&:hover'],
  invalid: '&[data-invalid], &[aria-invalid=true]',
  pressed: '&[data-pressed]',
  startingStyle: '&[data-starting-style]',
  vertical: '&[data-orientation=vertical]',
}

export const getVDropdownProps = () => ({
  clickOutsideForClose: {
    type: Boolean,
    default: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  manualToggle: {
    type: Boolean,
    default: false,
  },
});

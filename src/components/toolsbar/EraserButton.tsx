import IconButton from "./IconButton";

export default function EraserButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton isActive={isActive} onClick={onClick}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M8 12L24 28L20 32L4 16L8 12ZM26 10L30 6L30 10L26 10ZM6 18L18 30L22 26L10 14L6 18Z"
          fill="currentColor"
        />
      </svg>
    </IconButton>
  );
}

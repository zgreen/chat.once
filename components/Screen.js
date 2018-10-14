export default ({ isActiveScreen, isMobile, render }) => {
  if (!isMobile) {
    return render({})
  }
  const baseStyle = {
    gridColumn: '1/2',
    gridRow: '2/3',
    opacity: 0,
    pointerEvents: 'none',
    visibility: 'hidden'
  }
  const style = isActiveScreen
    ? { ...baseStyle, opacity: 1, pointerEvents: 'auto', visibility: 'visible' }
    : baseStyle
  return render(style)
}

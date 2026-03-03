export default function WorkspacePage() {
  return (
    <div style={{
      width: '100vw',
      height: '100svh',
      margin: 0,
      padding: 0,
      background: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <iframe
        src="/office/office.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          flex: 1,
        }}
        scrolling="no"
        title="迪恩·温彻斯特的像素办公室"
      />
    </div>
  )
}

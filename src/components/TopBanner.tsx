export default function TopBanner() {
  return (
    <div className="top-banner w-full h-[56px] relative" style={{ background: '#141300' }}>
      {/* Banner text centered */}
      <p
        className="top-banner-text font-heading absolute left-1/2 -translate-x-1/2"
        style={{
          top: '21px',
          width: 'min(900px, calc(100vw - 40px))',
          fontSize: '16px',
          lineHeight: '1.17em',
          color: '#FFFFFF',
          textAlign: 'center',
          whiteSpace: 'normal',
          WebkitTextStroke: '0.3px #FFFFFF',
        }}
      >
        March Move-In Special: Only 3 Slots Remaining for 30-Day Guaranteed Handover. Book Now.
      </p>
      {/* Gold line at bottom */}
      <div className="top-banner-line absolute bottom-0 left-1/2 -translate-x-1/2 w-[644px] h-[1px] bg-[#D7A648]" />
    </div>
  );
}

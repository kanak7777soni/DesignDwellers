export default function TopBanner() {
  return (
    <div className="w-full h-[56px] relative" style={{ background: '#141300' }}>
      {/* Banner text centered */}
      <p
        className="font-heading absolute left-1/2 -translate-x-1/2"
        style={{
          top: '21px',
          fontSize: '16px',
          lineHeight: '1.17em',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          WebkitTextStroke: '0.3px #FFFFFF',
        }}
      >
        March Move-In Special: Only 3 Slots Remaining for 30-Day Guaranteed Handover. Book Now.
      </p>
      {/* Gold line at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[644px] h-[1px] bg-[#D7A648]" />
    </div>
  );
}

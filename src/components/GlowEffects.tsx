interface Glow {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function GlowEffects({ glows, zIndex = -1 }: { glows: Glow[]; zIndex?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1440,
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      {glows.map((glow, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: glow.top,
            left: glow.left,
            width: glow.width,
            height: glow.height,
            borderRadius: '50%',
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(216, 166, 72, 0.32) 0%, rgba(215, 166, 72, 0) 100%)',
          }}
        />
      ))}
    </div>
  );
}

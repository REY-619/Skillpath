const PALETTE = ["#1F7A6C", "#2B4C7E", "#C97F0A", "#7A3B69", "#A8442A"];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function Avatar({ name, seed, size = 44 }: { name: string; seed: string; size?: number }) {
  const color = PALETTE[hashSeed(seed) % PALETTE.length];
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initials(name).toUpperCase()}
    </div>
  );
}

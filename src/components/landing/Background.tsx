/**
 * Full-bleed Goa illustration background, ported 1:1 from the approved
 * reference build: the real artwork with a top-to-bottom readability
 * gradient laid over it — no extra blur (the source art is already soft).
 */
export default function Background() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(7,23,17,0.2) 0%, rgba(7,23,17,0.6) 100%), url('/hacker_house_goa_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden="true"
    />
  );
}

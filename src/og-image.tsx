import { SHARE_OG_SITE_NAME, SHARE_OG_TITLE } from "./const/shareOg";

export default function OgImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #fff5fa 0%, #ffffff 55%)",
        color: "#370b27",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: 48,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.15,
          maxWidth: 1000,
        }}
      >
        {SHARE_OG_TITLE}
      </div>
      <div
        style={{
          fontSize: 32,
          marginTop: 28,
          opacity: 0.9,
        }}
      >
        {SHARE_OG_SITE_NAME}
      </div>
    </div>
  );
}

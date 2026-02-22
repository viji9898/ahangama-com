type Props = {
  imageUrl: string;
};

export function HeroBannerMobile({ imageUrl }: Props) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 120,
        height: 170,
        zIndex: 1,
        background: `url('${imageUrl}') center center/cover no-repeat`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        borderRadius: 0,
        marginBottom: 0,
      }}
    />
  );
}

import { Helmet } from "react-helmet-async";
import {
  SHARE_OG_SITE_NAME,
  SHARE_OG_TITLE,
  buildShareOgDescription,
} from "../../const/shareOg";
import { resolveOgImageUrl } from "../../utils/shareUrl";

type ShareMetaProps = {
  birthDate: string;
  shareUrl: string;
};

function readOgImageDimensions(): { width: string; height: string } {
  const width =
    document
      .querySelector('meta[property="og:image:width"]')
      ?.getAttribute("content") ?? "1200";
  const height =
    document
      .querySelector('meta[property="og:image:height"]')
      ?.getAttribute("content") ?? "630";

  return { width, height };
}

const ShareMeta = ({ birthDate, shareUrl }: ShareMetaProps) => {
  const description = buildShareOgDescription(birthDate);
  const imageUrl = resolveOgImageUrl();
  const { width, height } = readOgImageDimensions();

  return (
    <Helmet>
      <title>{SHARE_OG_TITLE}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SHARE_OG_SITE_NAME} />
      <meta property="og:title" content={SHARE_OG_TITLE} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content={width} />
      <meta property="og:image:height" content={height} />
      <meta property="og:url" content={shareUrl} />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SHARE_OG_TITLE} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default ShareMeta;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ヤマダデンキ iPhone 17 Pro Max 特別価格",
  openGraph: {
    title: "ヤマダデンキ iPhone 17 Pro Max 特別価格",
    description: "税込56,640円でiPhone 17 Pro Maxをゲット。在庫限りの期間限定オファー。",
    url: "https://www.discountnation.website/yamada/offer/iphone-17-yamada",
    images: [
      {
        url: "https://www.discountnation.website/images/yamada-logo.png",
      },
    ],
  },
};

export default function YamadaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

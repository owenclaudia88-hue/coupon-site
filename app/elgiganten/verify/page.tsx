import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaptchaRedirectClientWrapper from "./CaptchaRedirectClient";

export default function Page() {
  return (
    <>
      <Header />
      <CaptchaRedirectClientWrapper />
      <Footer />
    </>
  );
}

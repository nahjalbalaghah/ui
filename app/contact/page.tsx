import ContactHero from "./sections/hero/index";
import ContactFormSection from "./sections/form-section";

export const metadata = {
  title: "Contact | Nahj al-Balagha",
  description: "Get in touch with Nahj al-Balagha. Reach out for inquiries, support, or feedback. We value your connection.",
  openGraph: {
    title: "Contact | Nahj al-Balagha",
    description: "Get in touch with Nahj al-Balagha. Reach out for inquiries, support, or feedback. We value your connection.",
    url: "https://nahj-al-balagha.com/contact",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balagha Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Nahj al-Balagha",
    description: "Get in touch with Nahj al-Balagha. Reach out for inquiries, support, or feedback. We value your connection.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balagha Logo"
      }
    ]
  }
};

export default function Page() {
    return (
        <div>
            <ContactHero />
            <ContactFormSection />
        </div>
    )
} 
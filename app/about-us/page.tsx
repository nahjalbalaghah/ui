export const metadata = {
  title: "About Us | Nahj al-Balaghah",
  description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
  openGraph: {
    title: "About Us | Nahj al-Balaghah",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    url: "https://nahj-al-balagha.com/about-us",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Nahj al-Balaghah",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <h1 className="text-3xl lg:text-4xl font-black text-[#43896B] leading-tight mb-8">
        About Nahjalbalaghah.org
      </h1>

      <div className="space-y-5 text-gray-700 leading-relaxed">
        <p>
          <strong className="font-bold text-gray-900">Nahjalbalaghah.org</strong> is a non-profit
          digital humanities project dedicated to making <em>Nahj al-Balāghah</em>—the celebrated
          collection of sermons, letters, and sayings attributed to{" "}
          <strong className="font-bold text-gray-900">Imam Ali ibn Abi Talib (d. 661)</strong>—accessible
          to readers, students, and scholars around the world.
        </p>
        <p>
          Compiled by{" "}
          <strong className="font-bold text-gray-900">al-Sharif al-Radi (d. 1015)</strong>,{" "}
          <em>Nahj al-Balāghah</em> is revered for its eloquence, depth of thought, and enduring
          influence on Islamic philosophy, theology, literature, and ethics. Despite its global
          significance, reliable English-language resources on the text have long been limited. This
          project seeks to bridge that gap.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#43896B] mt-14 mb-5">Our Mission</h2>
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <p>
          Our mission is to provide an open-access, English-language digital platform for the study
          and appreciation of <em>Nahj al-Balāghah</em>—combining scholarship, technology, and
          accessibility.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            The project is grounded in{" "}
            <strong className="font-bold text-gray-900">academic rigor</strong>, ensuring that all
            materials—texts, translations, and analyses—meet the highest scholarly standards.
          </li>
          <li>
            Our audience is{" "}
            <strong className="font-bold text-gray-900">broad and inclusive</strong>, encompassing
            academics, researchers, students, interested readers, and people of faith who wish to
            engage deeply with the eloquence and wisdom of Imam Ali.
          </li>
          <li>
            The site hosts the text, translations, manuscripts, audio recordings, and related
            research, serving as a{" "}
            <strong className="font-bold text-gray-900">growing hub</strong> for both academic and
            public engagement.
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-[#43896B] mt-14 mb-5">What We Offer</h2>
      <ul className="space-y-5 text-gray-700 leading-relaxed">
        <li>
          <strong className="font-bold text-gray-900">Text &amp; Translation:</strong>
          <br />
          A searchable version of <em>Nahj al-Balāghah</em>, in both the original Arabic and
          translations into other languages, will provide readers with easy access to the entire
          text in their preferred language. The English translation will be based on Dr. Tahera
          Qutbuddin&rsquo;s critical edition and translation (<em>Brill, 2024</em>), the first direct
          English rendering from Arabic. This open-access translation, published with permission from
          Brill, provides an accurate and readable version of the text for the first time online. The
          website will include numerous critical editions of the Arabic text, including those edited
          by Tahera Qutbuddin (2025), Qays al-Attar (2025), and Hashim Milani (2010). It will also
          include a fully vocalized version of the Qutbuddin edition, a feature unique to the online
          format. Additional critical editions of the text will be added in due course, as will
          accurate and idiomatic translations into different languages.
        </li>
        <li>
          <strong className="font-bold text-gray-900">Recitations:</strong>
          <br />
          Professionally produced recitations of the entire Arabic text and its English translation
          bring the orations and letters to life, honoring their origins as spoken masterpieces.
        </li>
        <li>
          <strong className="font-bold text-gray-900">Digitized Manuscripts:</strong>
          <br />
          The site features high-resolution images of{" "}
          <strong className="font-bold text-gray-900">the earliest manuscripts</strong> of{" "}
          <em>Nahj al-Balāghah</em>, including 14 used in Professor Qutbuddin&rsquo;s critical
          edition. These rare manuscripts—held in libraries across India, Iran, Iraq, Turkey, and
          Ireland—offer invaluable insights into the text&rsquo;s transmission and reception history.
        </li>
        <li>
          <strong className="font-bold text-gray-900">Scholarly Resources:</strong>
          <br />
          Scholarly resources include indices, a glossary, an introduction, notes on the edition and
          translation, and detailed contents from Professor Qutbuddin&rsquo;s volume. The growing
          database will further include medieval and modern commentaries, bibliographical entries,
          and links to open-access research in English, Arabic, Persian, Urdu, and other languages.
        </li>
        <li>
          <strong className="font-bold text-gray-900">Timeline:</strong>
          <br />
          A timeline of the orations, letters, and sayings of Nahj al-Balaghah will be reconstructed
          and displayed on the website, based on evidence culled from various historical and literary
          sources. This timeline will provide invaluable historical context to many of the orations,
          letters, and sayings for which this evidence is available.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-[#43896B] mt-14 mb-5">Our Team</h2>
      <ul className="space-y-4 text-gray-700 leading-relaxed">
        <li>
          <strong className="font-bold text-gray-900">Project Principal:</strong>
          <br />
          <em>Professor Tahera Qutbuddin</em> — AlBabtain Laudian Professor of Arabic, University of
          Oxford; editor and translator of{" "}
          <em>Nahj al-Balāghah: The Eloquence and Wisdom of ʿAlī</em> (Brill, 2024).
        </li>
        <li>
          <strong className="font-bold text-gray-900">Web Developer:</strong>
          <br />
          <em>Syed Kazim Hussain</em> — Graduate of the Islamic Seminary of Qum (2020) and
          independent software development consultant.
        </li>
        <li>
          <strong className="font-bold text-gray-900">Research Manager:</strong>
          <br />
          <em>Reza Hemyari</em> — Ph.D. candidate, Department of Middle Eastern Studies, University of
          Chicago.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-[#43896B] mt-14 mb-5">Our Sponsor</h2>
      <p className="text-gray-700 leading-relaxed">
        <strong className="font-bold text-gray-900">
          Shia Research Institute, Toronto (
          <a
            href="https://shiaresearch.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#43896B] hover:text-[#43896B]/80 underline"
          >
            https://shiaresearch.ca/
          </a>
          )
        </strong>
      </p>

      <h2 className="text-2xl font-bold text-[#43896B] mt-14 mb-5">Our Ongoing Vision</h2>
      <p className="text-gray-700 leading-relaxed">
        We envision <em>Nahjalbalaghah.org</em> as a{" "}
        <strong className="font-bold text-gray-900">living digital archive</strong>—a comprehensive,
        continually expanding resource that connects tradition and technology. By combining scholarly
        rigor with open access, we aim to make the wisdom of Imam Ali available to all who seek
        knowledge, reflection, and eloquence.
      </p>
    </main>
  );
}

export interface ManuscriptMetadata {
  id: string;
  bookName: string;
  siglaArabic: string;
  siglaEnglish: string;
  hijriYear: string;
  gregorianYear: string;
  holdingInstitution: string;
  country: string;
  city: string;
  catalogNumber: string;
  specialMerit: string;
  rights: string;
  binding: string;
  acknowledgments: string;
  accessRestriction: string;
  iconName: string;
  repository: string;
  partLocation: string;
  cityOfOrigin: string;
  countryOfOrigin: string;
  pages: string[];
}

export const manuscripts: ManuscriptMetadata[] = [
  {
    id: "1",
    bookName: "Nahj al-Balagha - Mar'ashi Manuscript",
    siglaArabic: "مخطوطة مرعشي",
    siglaEnglish: "Mar'ashi",
    hijriYear: "469",
    gregorianYear: "1077",
    holdingInstitution: "Mar'ashi Library",
    country: "Iran",
    city: "Qum",
    catalogNumber: "469/1077",
    specialMerit: "One of the oldest known manuscripts of Nahj al-Balagha, featuring early calligraphic style and historical annotations.",
    rights: "Public Domain - Available for scholarly research",
    binding: "Traditional leather binding with gold embossing",
    acknowledgments: "Digitized and preserved by Mar'ashi Najafi Library",
    accessRestriction: "Open Access",
    iconName: "manuscript-icon",
    repository: "Mar'ashi Najafi Library Digital Archive",
    partLocation: "Complete manuscript in single volume",
    cityOfOrigin: "Qum",
    countryOfOrigin: "Iran",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  },
  {
    id: "2",
    bookName: "Nahj al-Balagha - Shahrastani Manuscript",
    siglaArabic: "مخطوطة شهرستاني",
    siglaEnglish: "Shahrastani",
    hijriYear: "5th-11th century",
    gregorianYear: "11th-12th century CE",
    holdingInstitution: "National Library of Iraq",
    country: "Iraq",
    city: "Baghdad",
    catalogNumber: "5th/11th c.",
    specialMerit: "Notable for its comprehensive commentary and beautiful illuminations.",
    rights: "Restricted - Permission required for reproduction",
    binding: "Persian-style binding with marbled endpapers",
    acknowledgments: "Iraqi National Library Preservation Project",
    accessRestriction: "Restricted Access - Research permission required",
    iconName: "manuscript-icon",
    repository: "National Library of Iraq",
    partLocation: "Two volume set",
    cityOfOrigin: "Baghdad",
    countryOfOrigin: "Iraq",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  },
  {
    id: "3",
    bookName: "Nahj al-Balagha - Nasiri Manuscript",
    siglaArabic: "مخطوطة ناصري",
    siglaEnglish: "Nasiri",
    hijriYear: "494",
    gregorianYear: "1101",
    holdingInstitution: "National Library of Iran",
    country: "Iran",
    city: "Tehran",
    catalogNumber: "494/1101",
    specialMerit: "Features extensive marginal notes by prominent scholars of the era.",
    rights: "Open Access - Creative Commons License",
    binding: "Modern conservation binding preserving original boards",
    acknowledgments: "National Library of Iran Digital Initiative",
    accessRestriction: "Open Access",
    iconName: "manuscript-icon",
    repository: "National Library of Iran Digital Collection",
    partLocation: "Complete in single volume",
    cityOfOrigin: "Tehran",
    countryOfOrigin: "Iran",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  },
  {
    id: "4",
    bookName: "Nahj al-Balagha - Rampur Raza Manuscript",
    siglaArabic: "مخطوطة رامبور رضا",
    siglaEnglish: "Rampur Raza",
    hijriYear: "553",
    gregorianYear: "1158",
    holdingInstitution: "Raza Library",
    country: "India",
    city: "Rampur",
    catalogNumber: "553/1158",
    specialMerit: "Renowned for its exceptional Naskh calligraphy and gold illumination.",
    rights: "Public Domain",
    binding: "Indo-Persian leather binding with intricate tooling",
    acknowledgments: "Raza Library Manuscript Preservation Committee",
    accessRestriction: "Open Access with registration",
    iconName: "manuscript-icon",
    repository: "Raza Library Rampur",
    partLocation: "Complete manuscript",
    cityOfOrigin: "Rampur",
    countryOfOrigin: "India",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  },
  {
    id: "5",
    bookName: "Nahj al-Balagha - Tehran University Manuscript",
    siglaArabic: "مخطوطة جامعة طهران",
    siglaEnglish: "Tehran University",
    hijriYear: "608",
    gregorianYear: "1212",
    holdingInstitution: "Tehran University Central Library",
    country: "Iran",
    city: "Tehran",
    catalogNumber: "608/1212",
    specialMerit: "Contains unique textual variants and scholarly annotations from medieval period.",
    rights: "Academic Use - Citation Required",
    binding: "19th century restoration binding",
    acknowledgments: "Tehran University Library Digitization Project",
    accessRestriction: "Academic Access Only",
    iconName: "manuscript-icon",
    repository: "Tehran University Central Library",
    partLocation: "Single volume, complete",
    cityOfOrigin: "Tehran",
    countryOfOrigin: "Iran",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  },
  {
    id: "6",
    bookName: "Nahj al-Balagha - Mumtaz ul Ulama Manuscript",
    siglaArabic: "مخطوطة ممتاز العلماء",
    siglaEnglish: "Mumtaz ul Ulama",
    hijriYear: "510",
    gregorianYear: "1116",
    holdingInstitution: "Mumtaz ul Ulama Library",
    country: "India",
    city: "Lucknow",
    catalogNumber: "510/1116",
    specialMerit: "Features comprehensive Persian translation alongside Arabic text.",
    rights: "Restricted - Special permission required",
    binding: "Mughal-era leather binding with gold work",
    acknowledgments: "Mumtaz ul Ulama Foundation",
    accessRestriction: "Restricted - Scholar access by appointment",
    iconName: "manuscript-icon",
    repository: "Mumtaz ul Ulama Library Lucknow",
    partLocation: "Complete manuscript with commentaries",
    cityOfOrigin: "Lucknow",
    countryOfOrigin: "India",
    pages: [
      "https://images.stockcake.com/public/c/1/3/c13ff623-e5c6-4728-b172-819719201871_large/ancient-manuscript-text-stockcake.jpg",
      "https://images.stockcake.com/public/f/b/9/fb98b78a-a5f6-4a8c-98c2-1b785f643f31_large/ancient-manuscript-texture-stockcake.jpg",
      "https://images.stockcake.com/public/6/1/e/61e6293c-fc25-42a3-93c0-377100b7dd4c_large/ancient-manuscript-paper-stockcake.jpg",
      "https://images.stockcake.com/public/8/4/9/849315f9-5ddc-41fd-b6a5-e6704fcb6148_large/ancient-arabic-manuscript-stockcake.jpg",
    ]
  }
];

export const getManuscriptById = (id: string): ManuscriptMetadata | undefined => {
  return manuscripts.find(m => m.id === id);
};

export const getManuscriptOptions = () => {
  return manuscripts.map(m => ({
    value: m.id,
    label: m.bookName
  }));
};

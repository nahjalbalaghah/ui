export interface IndexItem {
  word: string;
  references: string[];
}

export interface IndexCategory {
  slug: string;
  title: string;
  description: string;
  items: IndexItem[];
}

export const indexCategories: IndexCategory[] = [
  {
    slug: "names-places",
    title: "Index of Names and Places",
    description: "",
    items: [
      { word: "Aaron", references: ["1.2", "234.1"] },
      { word: "Abraham", references: ["1.2", "3.5", "7.1"] },
      { word: "Adam", references: ["1.1", "2.3", "91.1"] },
      { word: "Ali", references: ["4.2", "5.8", "9.1"] },
      { word: "Basra", references: ["13.1", "14.1"] },
      { word: "Damascus", references: ["56.1"] },
      { word: "Egypt", references: ["62.1", "53.1"] },
      { word: "Gabriel", references: ["2.7", "6.3", "192.1"] },
      { word: "Kufa", references: ["25.1", "27.1"] },
      { word: "Mecca", references: ["33.1"] },
      { word: "Medina", references: ["35.1"] },
      { word: "Moses", references: ["3.1", "4.9", "8.2", "234.1"] },
      { word: "Muawiyah", references: ["10.1", "55.1"] },
      { word: "Noah", references: ["160.1"] },
      { word: "Quraish", references: ["33.1", "17.1"] },
    ]
  },
  {
    slug: "terms",
    title: "Index of Terms",
    description: "Explore the rich vocabulary and terminology used by Imam Ali (AS) in Nahj al-Balaghah. This index covers important Arabic words, Islamic concepts, and technical terms.",
    items: [] // This one uses the API, so we can keep it empty or remove it if not used by static list
  },
  {
    slug: "quran-hadith",
    title: "Index of Qur'an, Hadith, Poetry, and Proverbs",
    description: "Discover the extensive references to the Holy Qur'an, prophetic traditions (Hadith), Arabic poetry, and traditional proverbs that Imam Ali (AS) incorporates into his eloquent discourse.",
    items: [
      { word: "Ammin (Amen)", references: ["1.1"] },
      { word: "Bismillāh", references: ["1.1"] },
      { word: "Hadith of the Cloak", references: ["2.2"] },
      { word: "Hadith of Two Weighty Things", references: ["3.3"] },
      { word: "Inna lillahi wa inna ilayhi raji'un", references: ["35.1"] },
      { word: "Poetry of Nimrod", references: ["5.1"] },
      { word: "Proverb: Haste is from the Devil", references: ["10.1"] },
      { word: "Qur'an", references: ["1.4", "2.2", "3.3", "18.1"] },
      { word: "Surah Al-Fatiha", references: ["1.1"] },
      { word: "Surah Al-Baqarah", references: ["1.2"] },
      { word: "Tradition of Ghadir", references: ["3.1"] },
    ]
  },
  {
    slug: "religious-concepts",
    title: "Index of Religious and Ethical Concepts",
    description: "Delve into the fundamental Islamic principles and ethical teachings that form the backbone of Nahj al-Balaghah. This index covers concepts such as justice, piety, leadership, and spirituality.",
    items: [
      { word: "Afterlife", references: ["20.1", "21.1"] },
      { word: "Asceticism (Zuhd)", references: ["3.1", "81.1"] },
      { word: "Death", references: ["20.1", "52.1", "110.1"] },
      { word: "Faith (Iman)", references: ["1.1", "2.1"] },
      { word: "Hypocrisy (Nifaq)", references: ["13.1", "19.1"] },
      { word: "Intellect ('Aql)", references: ["1.1", "30.1"] },
      { word: "Jihad", references: ["27.1", "110.1"] },
      { word: "Justice ('Adl)", references: ["1.3", "2.1", "3.2", "53.1"] },
      { word: "Knowledge ('Ilm)", references: ["1.1", "147.1"] },
      { word: "Leadership (Imamah)", references: ["1.6", "2.4", "3.1"] },
      { word: "Monotheism (Tawhid)", references: ["1.1", "185.1"] },
      { word: "Oppression (Zulm)", references: ["3.1", "224.1"] },
      { word: "Patience (Sabr)", references: ["3.1", "189.1"] },
      { word: "Piety (Taqwa)", references: ["1.5", "4.1", "193.1"] },
      { word: "Prayer (Salat)", references: ["199.1"] },
      { word: "Repentance (Tawbah)", references: ["142.1"] },
      { word: "Worldliness (Dunya)", references: ["3.1", "32.1", "45.1"] },
    ]
  }
];

export const getCategoryBySlug = (slug: string): IndexCategory | undefined => {
  return indexCategories.find(cat => cat.slug === slug);
};
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
    description: "This comprehensive index includes references to historical figures, prophets, companions of the Prophet Muhammad (PBUH), and various tribes and locations mentioned throughout Nahj al-Balaghah.",
    items: [
      {
        word: "Abraham",
        references: ["1.2", "3.5", "7.1"]
      },
      {
        word: "Adam",
        references: ["1.1", "2.3"]
      },
      {
        word: "Ali",
        references: ["4.2", "5.8", "9.1"]
      },
      {
        word: "Gabriel",
        references: ["2.7", "6.3"]
      },
      {
        word: "Moses",
        references: ["3.1", "4.9", "8.2"]
      },
      // Add more items as needed
    ]
  },
  {
    slug: "terms",
    title: "Index of Terms",
    description: "Explore the rich vocabulary and terminology used by Imam Ali (AS) in Nahj al-Balaghah. This index covers important Arabic words, Islamic concepts, and technical terms.",
    items: [
      {
        word: "Justice",
        references: ["1.3", "2.1", "3.2"]
      },
      {
        word: "Piety",
        references: ["1.5", "4.1"]
      },
      // Add more
    ]
  },
  {
    slug: "quran-hadith",
    title: "Index of Qur'an, Hadith, Poetry, and Proverbs",
    description: "Discover the extensive references to the Holy Qur'an, prophetic traditions (Hadith), Arabic poetry, and traditional proverbs that Imam Ali (AS) incorporates into his eloquent discourse.",
    items: [
      {
        word: "Qur'an",
        references: ["1.4", "2.2", "3.3"]
      },
      // Add more
    ]
  },
  {
    slug: "religious-concepts",
    title: "Index of Religious and Ethical Concepts",
    description: "Delve into the fundamental Islamic principles and ethical teachings that form the backbone of Nahj al-Balaghah. This index covers concepts such as justice, piety, leadership, and spirituality.",
    items: [
      {
        word: "Leadership",
        references: ["1.6", "2.4"]
      },
      // Add more
    ]
  }
];

export const getCategoryBySlug = (slug: string): IndexCategory | undefined => {
  return indexCategories.find(cat => cat.slug === slug);
};
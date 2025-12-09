export interface ManuscriptDetails {
    id: string;
    name: string;
    siglaEnglish: string;
    siglaArabic: string;
    library: string;
    city: string;
    country: string;
    date: string;
    catalogNumber: string;
    completeness: string;
    scribe: string;
    dimensions: string;
    originCity: string;
    features: string;
    permanentLink: string;
    orationSequence: string;
    format: string;
    additionalInfo: string;
}

export const STATIC_MANUSCRIPTS: Record<string, ManuscriptDetails> = {
    marashi: {
        id: 'marashi',
        name: "Mar'ashi MS 3827",
        siglaEnglish: 'M',
        siglaArabic: 'م',
        library: 'Ayatollah al-Najafī al-Marʿashī Library',
        city: 'Qom',
        country: 'Iran',
        date: '469 AH/1077 CE',
        catalogNumber: '3827',
        completeness: 'Almost complete in 171 folios, numbered in facsimile edition in 335 pages. The opening folios (Raḍī’s introduction, orations § 1.1–18), and folio 24r (orations § 1.55–59) are missing, and the facsimile edition inserts folios from later manuscripts to complete the text...The Sayings section is also missing a substantial portion (§ 3.132–355, § 3.429). A few sayings are in a different sequence than in some other manuscripts.',
        scribe: 'Abū ʿAbdallāh al-Ḥasan ibn al-Ḥusayn al-Muʾaddib al-Qummī (d. early 6th/12th c.)',
        dimensions: '',
        originCity: 'n/a',
        features: 'clear Naskh script, fully dotted and vocalized',
        permanentLink: 'create link',
        orationSequence: '1',
        format: 'Published in a single facsimile volume: “Nahj al-balāghah: Muṣawwarah min nuskah makhṭūṭah nādirah min al-qarn al-khāmis, Edited: Maḥmūd al-Marʿashī (Qum: Maktabat Ayatollah al-Najafī al-Marʿashī, 1406/1986)',
        additionalInfo: 'Mirza Abdallah Afandi, an 11/17th century historian who once owned the manuscript, writes that it was “checked against a manuscript read out [in a study session] to the compiler, Raḍī.”'
    },
    shahrastani: {
        id: 'shahrastani',
        name: "Shahrastani MS",
        siglaEnglish: 'S',
        siglaArabic: 'ش',
        library: 'Ayatollah Hibatallāh al-Shahrastānī Library',
        city: 'al-Kāẓimiyyah, Baghdad',
        country: 'Iraq',
        date: '406 AH (poss.)/1015 or 1016 CE',
        catalogNumber: 'n/a',
        completeness: '"The manuscript is almost complete in 175 folios. The first three folios of Raḍī’s introduction are missing,12 and there is some water damage throughout, especially on the last folios."',
        scribe: 'n/a',
        dimensions: '',
        originCity: 'n/a',
        features: 'In clear Naskh script with Kufic undertones; fully dotted with and vocalized; headings in red',
        permanentLink: '',
        orationSequence: '1',
        format: 'Published in a single facsimile volume, entitled, "Nahj al-Balagha, (London: Alulbayt Foundation, 2013)."',
        additionalInfo: ''
    }
};

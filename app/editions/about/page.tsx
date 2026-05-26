import React from 'react';
import PDFViewer from '@/app/components/pdf-viewer';

type SearchParams = { [key: string]: string | string[] | undefined };

const getEditionPdfUrl = (edition: string): string => {
  const normalized = edition.trim().toLowerCase();

  if (normalized.includes('qutbuddin')) return '/pdfs/TQ-Notes-on-the-Edition-and-Translation.pdf';
  if (normalized.includes('djebli')) return '/pdfs/Nahdj al-Balagha_Djebli_EI2.pdf';

  return '/pdfs/TQ-Notes-on-the-Edition-and-Translation.pdf';
};

export default function AboutEditionPage({ searchParams }: { searchParams?: SearchParams }) {
  const editionRaw = searchParams?.edition;
  const edition = Array.isArray(editionRaw) ? editionRaw[0] : editionRaw;
  const editionTitle = (edition || 'Edition').trim();
  const pdfUrl = getEditionPdfUrl(editionTitle);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-[#43896B]/10 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight">
              About this edition
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mt-6 mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {editionTitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-[#43896B]/20 rounded-xl overflow-hidden shadow-lg bg-white">
            <PDFViewer pdfUrl={pdfUrl} title={editionTitle} />
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Use the controls above to navigate pages, zoom, and view in fullscreen mode
          </p>
        </div>
      </section>
    </div>
  );
}


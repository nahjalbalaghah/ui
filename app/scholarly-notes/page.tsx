import React from 'react'
import { FileText, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'
import PDFViewer from '../components/pdf-viewer'

export const metadata: Metadata = {
  title: "Scholarly Notes on Edition and Translation | Nahj al-Balaghah",
  description: "Explore detailed scholarly notes on Tahera Qutbuddin's edition and translation of Nahj al-Balaghah, providing valuable insights into the academic work behind this timeless collection.",
  openGraph: {
    title: "Scholarly Notes on Edition and Translation | Nahj al-Balaghah",
    description: "Explore detailed scholarly notes on Tahera Qutbuddin's edition and translation of Nahj al-Balaghah.",
    url: "https://nahj-al-balagha.com/scholarly-notes",
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
    title: "Scholarly Notes on Edition and Translation | Nahj al-Balaghah",
    description: "Explore detailed scholarly notes on Tahera Qutbuddin's edition and translation of Nahj al-Balaghah.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
}

export default function ScholarlyNotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#43896B]/10 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#43896B]" />
              <span className="text-[#43896B] font-bold text-xl tracking-wide">Scholarly Notes</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
              Notes on <span className='text-[#43896B]'>Edition and Translation</span>
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the meticulous scholarly work behind Tahera Qutbuddin's edition and translation of Nahj al-Balaghah.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#43896B]/10 overflow-hidden">
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-[#43896B]" />
                    <h2 className="text-3xl lg:text-4xl font-black text-[#43896B] tracking-tight">
                      Tahera Qutbuddin's Edition and Translation
                    </h2>
                  </div>
                  <div className="h-1 bg-[#43896B] rounded-full w-24 mb-6"></div>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-lg">
                  <strong>Tahera Qutbuddin</strong> is a renowned scholar of Islamic studies, specializing in Arabic literature, Islamic history, and the intellectual traditions of Shi'i Islam. Her work on Nahj al-Balaghah represents a significant contribution to the field of Islamic scholarship.
                </p>
                <p>
                  This edition and translation brings together rigorous academic standards with deep cultural and linguistic understanding. Qutbuddin's approach combines philological precision with contextual awareness, making the profound wisdom of Imam Ali (AS) accessible to modern readers while preserving the richness of the original Arabic text.
                </p>
                <div className="bg-gradient-to-r from-[#43896B]/10 to-transparent p-6 rounded-xl my-8 border border-[#43896B]/20">
                  <h3 className="text-xl font-bold text-[#43896B] mb-3">Key Features of This Edition</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Authentic Sources:</strong> Based on the most reliable manuscript traditions and scholarly editions</li>
                    <li><strong>Linguistic Precision:</strong> Careful attention to Arabic grammar, rhetoric, and poetic devices</li>
                    <li><strong>Historical Context:</strong> Detailed notes explaining historical references and cultural background</li>
                    <li><strong>Theological Insights:</strong> Explanations of Islamic concepts and theological implications</li>
                    <li><strong>Comparative Analysis:</strong> References to parallel passages and related Islamic texts</li>
                  </ul>
                </div>
                <p>
                  The translation maintains the eloquence and rhetorical power of the original Arabic while ensuring clarity for contemporary readers. Qutbuddin's extensive footnotes provide invaluable context, explaining difficult passages, identifying literary devices, and connecting the text to broader Islamic intellectual traditions.
                </p>
                <p>
                  This scholarly work serves as a bridge between classical Islamic learning and modern academic discourse, making Nahj al-Balaghah's timeless wisdom accessible to students, scholars, and general readers alike.
                </p>
              </div>

              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-[#43896B]" />
                  <h3 className="text-2xl font-bold text-[#43896B]">View Scholarly Notes</h3>
                </div>
                <div className="border-2 border-[#43896B]/20 rounded-xl overflow-hidden shadow-lg">
                  <PDFViewer 
                    pdfUrl="/pdfs/TQ-Notes-on-the-Edition-and-Translation.pdf"
                    title="Scholarly Notes on Edition and Translation"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Use the controls above to navigate pages, zoom, and view in fullscreen mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
import React from 'react';
import Link from 'next/link';
import { IndexItem } from '@/app/data/indexes';
import { Hash } from 'lucide-react';

interface IndexListingProps {
  items: IndexItem[];
  categorySlug: string;
}

const IndexListing: React.FC<IndexListingProps> = ({ items, categorySlug }) => {
  const sortedItems = [...items].sort((a, b) => a.word.localeCompare(b.word));

  const getFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sortedItems.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#43896B]/30 hover:bg-gray-50/50 transition-all duration-300 overflow-hidden group">
            <div className="flex gap-0">
              <div className="shrink-0 relative">
                <div className="shrink-0 h-full relative flex items-center justify-center">
                  <div className="w-14 h-full bg-linear-to-br from-[#43896B] via-[#43896B]/90 to-[#367556] rounded-br-2xl rounded-r-none flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-50"></div>
                    <span className="text-lg font-black text-white drop-shadow-sm relative z-10">
                      {getFirstLetter(item.word)}
                    </span>
                    <div className="absolute -right-2 top-0 w-4 h-full bg-linear-to-r from-[#367556] to-transparent transform skew-x-12"></div>
                  </div>
                </div>
              </div>

              <div className="grow min-w-0 py-6 pr-6 pl-8">
                <div className="flex flex-col lg:flex-row items-end gap-4 lg:items-start justify-between">
                  <div className="grow min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#43896B] transition-colors duration-300 leading-normal">
                      {item.word}
                    </h3>
                    {item.references.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.references.slice(0, 5).map((ref, refIndex) => {
                          const [prefix] = ref.split('.');
                          let linkHref = '';
                          switch (prefix) {
                            case '0':
                              linkHref = `/introduction#${ref}`;
                              break;
                            case '1':
                              linkHref = `/orations#${ref}`;
                              break;
                            case '2':
                              linkHref = `/letters#${ref}`;
                              break;
                            case '3':
                              linkHref = `/sayings#${ref}`;
                              break;
                            default:
                              linkHref = `/#${ref}`;
                          }
                          return (
                            <Link
                              key={refIndex}
                              href={linkHref}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-linear-to-r from-[#43896B]/10 to-[#43896B]/5 text-[#43896B] rounded-full border border-[#43896B]/20 hover:from-[#43896B]/20 hover:to-[#43896B]/10 transition-all duration-300"
                            >
                              <Hash className="w-3.5 h-3.5" />
                              {ref}
                            </Link>
                          );
                        })}
                        {item.references.length > 5 && (
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                            +{item.references.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexListing;
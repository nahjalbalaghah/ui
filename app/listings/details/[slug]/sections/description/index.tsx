import React from 'react';

const ManuscriptDescription = ({ 
  title, 
  subtitle, 
  arabicText, 
  urduTranslation,
}: any) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        {subtitle}
      </p>
      {arabicText && (
        <div className="mb-8">
          <div className="text-right leading-loose text-xl text-gray-800 font-arabic" style={{ fontFamily: 'serif' }}>
            {arabicText.map((paragraph: any, index: any) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
      {urduTranslation && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Urdu Translation
          </h2>
          <div className="text-right leading-loose text-lg text-gray-800" style={{ fontFamily: 'serif' }}>
            {urduTranslation.map((paragraph: any, index: any) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManuscriptDescription;
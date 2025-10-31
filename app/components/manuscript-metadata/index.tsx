'use client';
import React, { useState } from 'react';
import { ManuscriptMetadata } from '@/app/data/manuscripts';
import { Book, Calendar, MapPin, FileText, Shield, Package, Award, Archive, Globe, Home } from 'lucide-react';

interface ManuscriptMetadataDisplayProps {
  metadata: ManuscriptMetadata;
}

type Tab = 'overview' | 'details' | 'provenance';

interface MetadataField {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const ManuscriptMetadataDisplay: React.FC<ManuscriptMetadataDisplayProps> = ({ metadata }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const overviewFields: MetadataField[] = [
    { label: 'Sigla (Arabic)', value: metadata.siglaArabic, icon: <Book className="w-4 h-4" /> },
    { label: 'Sigla (English)', value: metadata.siglaEnglish, icon: <Book className="w-4 h-4" /> },
    { label: 'Hijri Year', value: metadata.hijriYear, icon: <Calendar className="w-4 h-4" /> },
    { label: 'Gregorian Year', value: metadata.gregorianYear, icon: <Calendar className="w-4 h-4" /> },
    { label: 'Holding Institution', value: metadata.holdingInstitution, icon: <Archive className="w-4 h-4" /> },
    { label: 'City', value: metadata.city, icon: <MapPin className="w-4 h-4" /> },
    { label: 'Country', value: metadata.country, icon: <Globe className="w-4 h-4" /> },
  ];

  const detailsFields: MetadataField[] = [
    { label: 'Catalog Number', value: metadata.catalogNumber, icon: <FileText className="w-4 h-4" /> },
    { label: 'Special Merit', value: metadata.specialMerit, icon: <Award className="w-4 h-4" /> },
    { label: 'Binding', value: metadata.binding, icon: <Package className="w-4 h-4" /> },
    { label: 'Rights', value: metadata.rights, icon: <Shield className="w-4 h-4" /> },
    { label: 'Access Restriction', value: metadata.accessRestriction, icon: <Shield className="w-4 h-4" /> },
    { label: 'Acknowledgments', value: metadata.acknowledgments, icon: <FileText className="w-4 h-4" /> },
  ];

  const provenanceFields: MetadataField[] = [
    { label: 'Repository', value: metadata.repository, icon: <Archive className="w-4 h-4" /> },
    { label: 'Part Location', value: metadata.partLocation, icon: <MapPin className="w-4 h-4" /> },
    { label: 'City of Origin', value: metadata.cityOfOrigin, icon: <Home className="w-4 h-4" /> },
    { label: 'Country of Origin', value: metadata.countryOfOrigin, icon: <Globe className="w-4 h-4" /> },
  ];

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview' },
    { id: 'details' as Tab, label: 'Details' },
    { id: 'provenance' as Tab, label: 'Provenance' },
  ];

  const renderFields = (fields: MetadataField[]) => (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="border-b border-[#E2E3E9] pb-4 last:border-0">
          <div className="flex items-start gap-2">
            {field.icon && (
              <div className="text-[#43896B] mt-1">
                {field.icon}
              </div>
            )}
            <div className="flex-1">
              <dt className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                {field.value}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-[#43896B] to-[#5CAF8B] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Manuscript Information</h2>
      </div>
      <div className="border-b border-[#E2E3E9] bg-[#F5F6FA]">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#43896B] bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#43896B]" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            {renderFields(overviewFields)}
          </div>
        )}
        {activeTab === 'details' && (
          <div className="animate-fadeIn">
            {renderFields(detailsFields)}
          </div>
        )}
        {activeTab === 'provenance' && (
          <div className="animate-fadeIn">
            {renderFields(provenanceFields)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManuscriptMetadataDisplay;

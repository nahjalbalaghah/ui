'use client';
import React, { useEffect, useState } from 'react';
import Select from '@/app/components/select';
import { postsApi, type Edition } from '@/api/posts';
import { getPreference, setPreference } from '@/app/utils/preferences';

const DEFAULT_EDITION = 'Qutbuddin';

interface EditionPickerProps {
  className?: string;
}

// Lets the user choose the edition used across the listing and details pages.
// The choice is stored as a cookie preference.
export default function EditionPicker({ className = '' }: EditionPickerProps) {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedEdition, setSelectedEdition] = useState('');

  useEffect(() => {
    setSelectedEdition(getPreference('edition') || DEFAULT_EDITION);
    postsApi.getEditions()
      .then(res => setEditions(res.data || []))
      .catch(console.error);
  }, []);

  if (editions.length === 0) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 ${className}`}>
      <label className="text-base font-semibold text-gray-700">Edition</label>
      <Select
        options={editions.map(ed => ({ value: ed.title, label: ed.title }))}
        value={selectedEdition}
        onChange={(value) => {
          setSelectedEdition(value);
          setPreference('edition', value);
        }}
        placeholder="Select edition"
        className="w-64"
      />
    </div>
  );
}



export const extractReferences = (text: string): string[] => {
  if (!text) return [];
  const matches = text.match(/«([^»]+)»/g);
  return matches ? matches.map(ref => ref.replace(/«|»/g, '')) : [];
};

export const replaceReferencesWithSuperscripts = (text: string, refs: string[]): React.ReactNode[] => {
  if (!text) return [text];
  let refIndex = 0;
  const parts = text.split(/(«[^»]+»)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('«') && part.endsWith('»')) {
      refIndex++;
      return <sup key={idx} className="text-xs align-super mx-1 text-[#43896B]">[{refIndex}]</sup>;
    }
    return part;
  });
};
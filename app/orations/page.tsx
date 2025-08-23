'use client';
import React, { useState } from 'react';
import ContentPage from '@/app/components/content/content-page';
import { orationsApi } from '@/api/posts';
import Button from '@/app/components/button';
import Modal from '@/app/components/modal';

const config = {
  contentType: 'orations' as const,
  title: 'Orations',
  subtitle: 'The powerful orations of Imam Ali, addressing justice, society, and spirituality with profound wisdom and eloquence.',
  api: {
    getContent: orationsApi.getOrations,
    searchContent: orationsApi.searchOrations,
  }
};

export default function OrationsPage() {
  const configWithListView = {
    ...config,
    forceListView: true,
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button variant="solid" onClick={() => setModalOpen(true)}>
          Radi's introduction and conclusion
        </Button>
      </div>
      <ContentPage config={configWithListView} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Radi's introduction and conclusion">
        <div className="py-4 max-w-xl mx-auto">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Introduction (Preface)</h2>
            <blockquote className="italic my-4 bg-gray-100 border-l-4 border-primary px-4 py-3">
              “In my early age at the dawn of youth, I commenced writing Khaṣāʼiṣ al-A’immah, on the characteristics of the Imams—covering their virtues and masterpieces of their utterances. I completed the portion relating to Amīr al-Muʼminīn ‘Ali (peace be upon him), but was unable to complete the parts about the other Imams due to the time’s impediments. I divided the book into sections, designing the last part to include all of Ali’s brief utterances—counsels, maxims, and proverbs—but not long lectures or detailed discourses.”
            </blockquote>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
            <p>
              While the exact wording of Sharīf al-Raḍī’s conclusion is not available here, Brill’s manuscript description notes that his compilation is “bookended by Raḍī’s introduction and brief conclusion.” If you have access to a printed or digital edition of Nahj al-Balāghah that includes it, you can extract and insert Raḍī’s concluding remarks here.
            </p>
          </section>
        </div>
      </Modal>
    </>
  );
}

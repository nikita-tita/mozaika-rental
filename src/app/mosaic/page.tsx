'use client';

import React from 'react';
import MosaicBuilder from '@/components/mosaic/MosaicBuilder';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function MosaicPage() {
  const handleWorkflowComplete = (workflow: any) => {
    console.log('Workflow completed:', workflow);
    // Здесь можно добавить логику сохранения workflow или перенаправления
    alert(`Сделка завершена! Стоимость: ${workflow.totalCost}₽`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>
      </div>
      
      <MosaicBuilder onComplete={handleWorkflowComplete} />
    </div>
  );
} 
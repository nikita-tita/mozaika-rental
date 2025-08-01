'use client';

import React from 'react';
import MosaicBuilder from '@/components/mosaic/MosaicBuilder';

export default function MosaicPage() {
  const handleWorkflowComplete = (workflow: any) => {
    console.log('Workflow completed:', workflow);
    // Здесь можно добавить логику сохранения workflow или перенаправления
    alert(`Сделка завершена! Стоимость: ${workflow.totalCost}₽`);
  };

  return (
    <MosaicBuilder onComplete={handleWorkflowComplete} />
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { FileText, User, CheckCircle, Clock, AlertCircle, Download, Send, Eye, Lock } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'inventory' | 'insurance' | 'escrow';
  status: 'pending' | 'signed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  signers: Signer[];
  fileUrl: string;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'landlord' | 'tenant' | 'realtor' | 'witness';
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
  signatureMethod?: 'sms' | 'email' | 'gosuslugi';
}

interface DigitalSignatureProps {
  documents: Document[];
  onComplete: (signedDocuments: Document[]) => void;
  onBack: () => void;
}

export default function DigitalSignature({ documents, onComplete, onBack }: DigitalSignatureProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<'sms' | 'email' | 'gosuslugi'>('sms');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  // Статусы документов
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'Подписан';
      case 'pending': return 'Ожидает подписи';
      case 'expired': return 'Истек срок';
      default: return 'Неизвестно';
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'contract': return 'Договор аренды';
      case 'inventory': return 'Опись имущества';
      case 'insurance': return 'Страховой полис';
      case 'escrow': return 'Эскроу-соглашение';
      default: return 'Документ';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return '📄';
      case 'inventory': return '📋';
      case 'insurance': return '🛡️';
      case 'escrow': return '🏦';
      default: return '📄';
    }
  };

  // Отправка кода верификации
  const sendVerificationCode = async (signer: Signer) => {
    setIsProcessing(true);
    
    // Имитация отправки кода
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowVerification(true);
    setIsProcessing(false);
  };

  // Подтверждение подписи
  const confirmSignature = async () => {
    if (!verificationCode || !selectedDocument) return;
    
    setIsProcessing(true);
    
    // Имитация проверки кода
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // В демо-версии принимаем любой код
    const updatedDocument = {
      ...selectedDocument,
      signers: selectedDocument.signers.map(signer =>
        signer.id === 'current-user'
          ? { ...signer, status: 'signed' as const, signedAt: new Date(), signatureMethod }
          : signer
      ),
      status: selectedDocument.signers.every(s => s.id === 'current-user' || s.status === 'signed') 
        ? 'signed' as const
        : 'pending' as const
    };
    
    setSelectedDocument(updatedDocument);
    setShowVerification(false);
    setVerificationCode('');
    setIsProcessing(false);
    
    // Показываем успех
    alert('✅ Документ успешно подписан!\n\nПодпись имеет юридическую силу.\n\nВ реальной версии здесь будет:\n- Сохранение в архиве\n- Отправка копий сторонам\n- Интеграция с реестром')
    
    // Проверяем, все ли подписали
    const allSigned = updatedDocument.signers.every(s => s.status === 'signed');
    if (allSigned) {
      setTimeout(() => {
        onComplete([updatedDocument]);
      }, 1000);
    }
  };

  // Отправка документов на подпись
  const sendForSignature = async (document: Document) => {
    setIsProcessing(true);
    
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const updatedDocument = {
      ...document,
      status: 'pending' as const,
      signers: document.signers.map(signer => ({
        ...signer,
        status: 'pending' as const
      }))
    };
    
    setSelectedDocument(updatedDocument);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">✍️ Электронная подпись</h1>
              <p className="text-gray-400">Безопасное подписание документов через ЭЦП</p>
            </div>
          </div>
          
          {/* Прогресс */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep >= 2 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep >= 3 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Шаг 1: Список документов */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Документы для подписания</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">50₽</div>
                  <div className="text-sm text-gray-400">за документ</div>
                </div>
              </div>

              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getDocumentTypeIcon(doc.type)}</div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-gray-400 text-sm">{getDocumentTypeText(doc.type)}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`flex items-center gap-1 text-sm ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              {getStatusText(doc.status)}
                            </span>
                            <span className="text-gray-400 text-sm">
                              Создан: {doc.createdAt.toLocaleDateString()}
                            </span>
                            <span className="text-gray-400 text-sm">
                              Истекает: {doc.expiresAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                          title="Просмотреть документ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                          title="Скачать документ"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setCurrentStep(2);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Подписать
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Выбор способа подписи */}
        {currentStep === 2 && selectedDocument && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Выберите способ подписи</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Документ: {selectedDocument.name}</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getDocumentTypeIcon(selectedDocument.type)}</span>
                    <div>
                      <p className="font-medium">{getDocumentTypeText(selectedDocument.type)}</p>
                      <p className="text-gray-400 text-sm">Создан {selectedDocument.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Подписанты:</p>
                    {selectedDocument.signers.map((signer) => (
                      <div key={signer.id} className="flex items-center justify-between bg-gray-600 rounded p-2">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm">{signer.name}</p>
                            <p className="text-gray-400 text-xs">{signer.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          signer.status === 'signed' ? 'bg-green-500/20 text-green-400' :
                          signer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {signer.status === 'signed' ? 'Подписан' :
                           signer.status === 'pending' ? 'Ожидает' : 'Отклонен'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Способы подписи:</h3>
                
                <div className="grid gap-4">
                  <label className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                    <input
                      type="radio"
                      name="signatureMethod"
                      value="sms"
                      checked={signatureMethod === 'sms'}
                      onChange={(e) => setSignatureMethod(e.target.value as any)}
                      className="w-4 h-4 text-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          📱
                        </div>
                        <div>
                          <p className="font-medium">SMS-подпись</p>
                          <p className="text-gray-400 text-sm">Код подтверждения на телефон</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-medium">Бесплатно</p>
                      <p className="text-gray-400 text-xs">Мгновенно</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                    <input
                      type="radio"
                      name="signatureMethod"
                      value="email"
                      checked={signatureMethod === 'email'}
                      onChange={(e) => setSignatureMethod(e.target.value as any)}
                      className="w-4 h-4 text-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          📧
                        </div>
                        <div>
                          <p className="font-medium">Email-подпись</p>
                          <p className="text-gray-400 text-sm">Ссылка для подписи на email</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-medium">Бесплатно</p>
                      <p className="text-gray-400 text-xs">5-10 минут</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                    <input
                      type="radio"
                      name="signatureMethod"
                      value="gosuslugi"
                      checked={signatureMethod === 'gosuslugi'}
                      onChange={(e) => setSignatureMethod(e.target.value as any)}
                      className="w-4 h-4 text-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                          🏛️
                        </div>
                        <div>
                          <p className="font-medium">Госуслуги ЭЦП</p>
                          <p className="text-gray-400 text-sm">Квалифицированная электронная подпись</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-medium">200₽</p>
                      <p className="text-gray-400 text-xs">1-2 минуты</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={() => {
                    if (signatureMethod === 'gosuslugi') {
                      setCurrentStep(3);
                    } else {
                      sendVerificationCode(selectedDocument.signers[0]);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Подписать документ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Подтверждение подписи */}
        {currentStep === 3 && selectedDocument && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Подтверждение подписи</h2>
              
              {showVerification ? (
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Код отправлен</h3>
                    <p className="text-gray-400 mb-4">
                      Введите код подтверждения, отправленный на ваш {signatureMethod === 'sms' ? 'телефон' : 'email'}
                    </p>
                    
                    <div className="max-w-xs mx-auto">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg font-mono"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowVerification(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={confirmSignature}
                      disabled={verificationCode.length !== 6 || isProcessing}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Проверяем...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Подтвердить подпись
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Безопасная подпись</h3>
                        <p className="text-gray-400 text-sm">
                          {signatureMethod === 'sms' ? 'SMS-код подтверждения' :
                           signatureMethod === 'email' ? 'Email-ссылка для подписи' :
                           'Квалифицированная ЭЦП через Госуслуги'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Документ:</span>
                        <span className="font-medium">{selectedDocument.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Способ подписи:</span>
                        <span className="font-medium">
                          {signatureMethod === 'sms' ? 'SMS-подпись' :
                           signatureMethod === 'email' ? 'Email-подпись' :
                           'Госуслуги ЭЦП'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Стоимость:</span>
                        <span className="font-medium text-green-400">
                          {signatureMethod === 'gosuslugi' ? '200₽' : 'Бесплатно'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => sendVerificationCode(selectedDocument.signers[0])}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Отправляем...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Отправить код
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsModal } from '@/components/ui/teams'
import { FileSignature, Upload, Download, CheckCircle, Clock, AlertCircle, Shield, Send, Eye, Trash2, Plus } from 'lucide-react'
import SignerSelector from '@/components/signature/SignerSelector'

interface SignatureDocument {
  id: string
  documentType: string
  documentUrl: string
  status: 'pending' | 'signed' | 'expired' | 'cancelled'
  signedAt?: string
  sentAt?: string
  createdAt: string
  signers: SignatureSigner[]
}

interface SignatureSigner {
  id: string
  role: 'landlord' | 'tenant' | 'realtor' | 'witness'
  status: 'pending' | 'sent' | 'signed' | 'declined' | 'expired'
  email?: string
  phone?: string
  signedAt?: string
  client?: {
    firstName: string
    lastName: string
  }
}

export default function SignaturePage() {
  const [documents, setDocuments] = useState<SignatureDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showSignersModal, setShowSignersModal] = useState(false)
  const [showSignerSelector, setShowSignerSelector] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClients, setSelectedClients] = useState<any[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const documentTypes = [
    { value: 'contract', label: 'Договор аренды' },
    { value: 'inventory', label: 'Опись имущества' },
    { value: 'insurance', label: 'Страховой полис' },
    { value: 'escrow', label: 'Эскроу-соглашение' },
    { value: 'other', label: 'Другой документ' }
  ]

  // Загрузка документов
  useEffect(() => {
    fetchDocuments()
    fetchClients()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/signatures')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType || selectedClients.length === 0) {
      alert('Пожалуйста, выберите файл, тип документа и подписантов')
      return
    }

    setUploading(true)
    try {
      // Загружаем файл
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const uploadResponse = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData
      })
      
      const uploadData = await uploadResponse.json()
      
      if (!uploadData.success) {
        throw new Error(uploadData.error)
      }

      // Создаем документ для подписи
      const signatureResponse = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentType: selectedDocumentType,
          documentUrl: uploadData.data.url,
          signers: selectedClients.map(client => ({
            clientId: client.id,
            role: client.role || 'tenant',
            email: client.email,
            phone: client.phone
          }))
        })
      })

      const signatureData = await signatureResponse.json()
      
      if (signatureData.success) {
        setDocuments(prev => [signatureData.data, ...prev])
        setShowUploadModal(false)
        setSelectedClients([])
        setSelectedFile(null)
        setSelectedDocumentType('')
      } else {
        throw new Error(signatureData.error)
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Ошибка при загрузке документа')
    } finally {
      setUploading(false)
    }
  }

  const handleSignersConfirm = (signers: any[]) => {
    setSelectedClients(signers)
    setShowSignerSelector(false)
  }

  const sendForSignature = async (documentId: string) => {
    try {
      const response = await fetch(`/api/signatures/${documentId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Обновляем документ в списке
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? data.data : doc
        ))
        alert('Документ отправлен на подпись')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error sending document:', error)
      alert('Ошибка при отправке документа')
    }
  }

  const downloadDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/signatures/${documentId}/download`)
      const data = await response.json()
      
      if (data.success) {
        // В реальной системе здесь будет скачивание файла
        // Для демо-версии показываем информацию
        alert(`Документ готов для скачивания: ${data.data.fileName}`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Ошибка при скачивании документа')
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
      return
    }

    try {
      const response = await fetch(`/api/signatures/${documentId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
        alert('Документ удален')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Ошибка при удалении документа')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'success'
      case 'pending': return 'warning'
      case 'expired': return 'error'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'Подписан'
      case 'pending': return 'Ожидает подписи'
      case 'expired': return 'Истек срок'
      case 'cancelled': return 'Отменен'
      default: return 'Неизвестно'
    }
  }

  const getDocumentTypeText = (type: string) => {
    return documentTypes.find(t => t.value === type)?.label || 'Документ'
  }

  const getSignerStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'Подписал'
      case 'pending': return 'Ожидает'
      case 'sent': return 'Отправлено'
      case 'declined': return 'Отклонил'
      case 'expired': return 'Истекло'
      default: return 'Неизвестно'
    }
  }

  const getSignerRoleText = (role: string) => {
    switch (role) {
      case 'landlord': return 'Арендодатель'
      case 'tenant': return 'Арендатор'
      case 'realtor': return 'Риелтор'
      case 'witness': return 'Свидетель'
      default: return 'Подписант'
    }
  }

  const addClientToSelection = (client: any, role: string) => {
    setSelectedClients(prev => [...prev, { ...client, role }])
  }

  const removeClientFromSelection = (clientId: string) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <FileSignature className="w-8 h-8 mr-3 text-blue-600" />
            Электронная подпись
          </h1>
          <p className="text-lg text-gray-600">
            Безопасное подписание документов онлайн с юридической силой
          </p>
        </div>

        {/* Кнопка добавления документа */}
        <div className="mb-8">
          <TeamsButton onClick={() => setShowUploadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить документ для подписи
          </TeamsButton>
        </div>

        {/* Список документов */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Мои документы</h2>
          
          {documents.length === 0 ? (
            <TeamsCard className="p-8 text-center">
              <FileSignature className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">У вас пока нет документов для подписи</p>
              <TeamsButton onClick={() => setShowUploadModal(true)}>
                Добавить первый документ
              </TeamsButton>
            </TeamsCard>
          ) : (
            documents.map((doc) => (
              <TeamsCard key={doc.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(doc.status)}
                      <h3 className="font-semibold text-gray-900 ml-2">
                        {getDocumentTypeText(doc.documentType)}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Тип: {getDocumentTypeText(doc.documentType)}</div>
                      <div>Создан: {new Date(doc.createdAt).toLocaleDateString('ru-RU')}</div>
                      {doc.signedAt && (
                        <div>Подписан: {new Date(doc.signedAt).toLocaleDateString('ru-RU')}</div>
                      )}
                      {doc.sentAt && (
                        <div>Отправлен: {new Date(doc.sentAt).toLocaleDateString('ru-RU')}</div>
                      )}
                      <div>Подписанты: {doc.signers.length}</div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <TeamsBadge variant={getStatusColor(doc.status)}>
                      {getStatusText(doc.status)}
                    </TeamsBadge>
                  </div>
                </div>
                
                {/* Список подписантов */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Подписанты:</h4>
                  <div className="space-y-2">
                    {doc.signers.map((signer) => (
                      <div key={signer.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium">
                            {signer.client ? `${signer.client.firstName} ${signer.client.lastName}` : 'Неизвестно'}
                          </span>
                          <span className="text-gray-500 ml-2">({getSignerRoleText(signer.role)})</span>
                        </div>
                        <TeamsBadge variant={signer.status === 'signed' ? 'success' : 'warning'}>
                          {getSignerStatusText(signer.status)}
                        </TeamsBadge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <TeamsButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadDocument(doc.id)}
                    disabled={doc.status !== 'signed'}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Скачать
                  </TeamsButton>
                  
                  <TeamsButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedDocument(doc)
                      setShowSignersModal(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Просмотр
                  </TeamsButton>
                  
                  {doc.status === 'pending' && (
                    <TeamsButton 
                      size="sm"
                      onClick={() => sendForSignature(doc.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Отправить на подпись
                    </TeamsButton>
                  )}
                  
                  <TeamsButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Удалить
                  </TeamsButton>
                </div>
              </TeamsCard>
            ))
          )}
        </div>

        {/* Модальное окно загрузки документа */}
        <TeamsModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Добавить документ для подписи"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип документа
              </label>
              <TeamsSelect
                options={documentTypes}
                placeholder="Выберите тип документа"
                value={selectedDocumentType}
                onChange={(value) => setSelectedDocumentType(value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Файл документа
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  {selectedFile ? selectedFile.name : 'Перетащите документ сюда или нажмите для выбора файла'}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedFile(file)
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <TeamsButton variant="outline" disabled={uploading}>
                    {uploading ? 'Загрузка...' : 'Выбрать файл'}
                  </TeamsButton>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подписанты ({selectedClients.length})
              </label>
              <div className="space-y-2">
                {selectedClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{client.firstName} {client.lastName} ({getSignerRoleText(client.role)})</span>
                    <TeamsButton
                      variant="outline"
                      size="sm"
                      onClick={() => removeClientFromSelection(client.id)}
                    >
                      Удалить
                    </TeamsButton>
                  </div>
                ))}
                <TeamsButton
                  variant="outline"
                  onClick={() => setShowSignerSelector(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить подписанта
                </TeamsButton>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <TeamsButton variant="outline" onClick={() => setShowUploadModal(false)}>
                Отмена
              </TeamsButton>
              <TeamsButton 
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !selectedDocumentType || selectedClients.length === 0}
              >
                {uploading ? 'Загрузка...' : 'Создать документ для подписи'}
              </TeamsButton>
            </div>
          </div>
        </TeamsModal>

        {/* Модальное окно просмотра документа */}
        <TeamsModal
          isOpen={showSignersModal}
          onClose={() => setShowSignersModal(false)}
          title="Детали документа"
        >
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {getDocumentTypeText(selectedDocument.documentType)}
                </h3>
                <p className="text-sm text-gray-600">
                  Статус: {getStatusText(selectedDocument.status)}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Подписанты:</h4>
                <div className="space-y-2">
                  {selectedDocument.signers.map((signer) => (
                    <div key={signer.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <div className="font-medium">
                          {signer.client ? `${signer.client.firstName} ${signer.client.lastName}` : 'Неизвестно'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getSignerRoleText(signer.role)}
                        </div>
                      </div>
                      <div className="text-right">
                        <TeamsBadge variant={signer.status === 'signed' ? 'success' : 'warning'}>
                          {getSignerStatusText(signer.status)}
                        </TeamsBadge>
                        {signer.signedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(signer.signedAt).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TeamsModal>

        {/* Преимущества */}
        <TeamsCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Преимущества электронной подписи</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Юридическая сила</h3>
              <p className="text-gray-600 text-sm">
                Подписи имеют полную юридическую силу согласно российскому законодательству
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Быстро и удобно</h3>
              <p className="text-gray-600 text-sm">
                Подписание документов за несколько минут без личных встреч
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Безопасность</h3>
              <p className="text-gray-600 text-sm">
                Защищенная передача и хранение документов с шифрованием
              </p>
            </div>
          </div>
        </TeamsCard>

        {/* Компонент выбора подписантов */}
        <SignerSelector
          isOpen={showSignerSelector}
          onClose={() => setShowSignerSelector(false)}
          onConfirm={handleSignersConfirm}
          selectedSigners={selectedClients}
        />
      </div>
    </div>
  )
} 
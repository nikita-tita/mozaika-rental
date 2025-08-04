'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect } from '@/components/ui/teams'
import { FileSignature, Upload, Download, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react'

export default function SignaturePage() {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Договор аренды квартиры.pdf',
      type: 'CONTRACT',
      status: 'SIGNED',
      signedAt: '2024-01-15',
      signers: ['Иванов И.И.', 'Петров П.П.'],
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Акт приема-передачи.pdf',
      type: 'ACT',
      status: 'PENDING',
      signedAt: null,
      signers: ['Иванов И.И.'],
      size: '1.1 MB'
    }
  ])
  const [uploading, setUploading] = useState(false)

  const documentTypes = [
    { value: 'CONTRACT', label: 'Договор аренды' },
    { value: 'ACT', label: 'Акт приема-передачи' },
    { value: 'ADDENDUM', label: 'Дополнительное соглашение' },
    { value: 'OTHER', label: 'Другой документ' }
  ]

  const handleUpload = async (file: File) => {
    setUploading(true)
    // Имитация загрузки
    setTimeout(() => {
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        type: 'OTHER',
        status: 'PENDING',
        signedAt: null,
        signers: [],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }
      setDocuments(prev => [newDoc, ...prev])
      setUploading(false)
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <TeamsBadge variant="warning">Ожидает подписи</TeamsBadge>
      case 'SIGNED':
        return <TeamsBadge variant="success">Подписан</TeamsBadge>
      case 'EXPIRED':
        return <TeamsBadge variant="error">Истек</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'SIGNED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'EXPIRED':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <FileSignature className="w-8 h-8 mr-3 text-blue-600" />
            Цифровая подпись
          </h1>
          <p className="text-lg text-gray-600">
            Безопасное подписание документов онлайн с юридической силой
          </p>
        </div>

        {/* Загрузка документов */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Загрузить документ</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Перетащите документ сюда или нажмите для выбора файла
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
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
        </TeamsCard>

        {/* Список документов */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Мои документы</h2>
          
          {documents.map((doc) => (
            <TeamsCard key={doc.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(doc.status)}
                    <h3 className="font-semibold text-gray-900 ml-2">{doc.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Тип: {documentTypes.find(t => t.value === doc.type)?.label}</div>
                    <div>Размер: {doc.size}</div>
                    {doc.signers.length > 0 && (
                      <div>Подписанты: {doc.signers.join(', ')}</div>
                    )}
                    {doc.signedAt && (
                      <div>Подписан: {doc.signedAt}</div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(doc.status)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <TeamsButton variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Скачать
                </TeamsButton>
                {doc.status === 'PENDING' && (
                  <TeamsButton size="sm">
                    <FileSignature className="w-4 h-4 mr-1" />
                    Подписать
                  </TeamsButton>
                )}
                <TeamsButton variant="outline" size="sm">
                  Отправить на подпись
                </TeamsButton>
              </div>
            </TeamsCard>
          ))}
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Юридическая сила</h3>
            <p className="text-gray-600">
              Подписи имеют полную юридическую силу согласно ФЗ "Об электронной подписи"
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Экономия времени</h3>
            <p className="text-gray-600">
              Подписание документов за несколько минут вместо дней ожидания
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Безопасность</h3>
            <p className="text-gray-600">
              Криптографическая защита и аудит всех операций с документами
            </p>
          </TeamsCard>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{documents.length}</div>
            <div className="text-gray-600">Всего документов</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {documents.filter(d => d.status === 'SIGNED').length}
            </div>
            <div className="text-gray-600">Подписанных документов</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.5 мин</div>
            <div className="text-gray-600">Среднее время подписания</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
            <div className="text-gray-600">Безопасность подписей</div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 
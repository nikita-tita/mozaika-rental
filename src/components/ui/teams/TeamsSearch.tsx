'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { TeamsInput, TeamsButton, TeamsSelect } from './index'

interface SearchFilter {
  field: string
  value: string
  label: string
}

interface TeamsSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSearch?: (query: string, filters: SearchFilter[]) => void
  resultsCount?: number
  showFilters?: boolean
  filterOptions?: Array<{
    value: string
    label: string
    field: string
  }>
  searchFields?: string[]
  debounceMs?: number
  clearable?: boolean
}

export function TeamsSearch({
  value,
  onChange,
  placeholder = "Поиск...",
  className = "",
  onSearch,
  resultsCount,
  showFilters = false,
  filterOptions = [],
  searchFields = [],
  debounceMs = 300,
  clearable = true
}: TeamsSearchProps) {
  const [searchValue, setSearchValue] = useState(value)
  const [filters, setFilters] = useState<SearchFilter[]>([])
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onChange(searchValue)
      if (onSearch) {
        onSearch(searchValue, filters)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue, filters, onChange, onSearch, debounceMs])

  const handleClear = () => {
    setSearchValue('')
    setFilters([])
    onChange('')
    if (onSearch) {
      onSearch('', [])
    }
  }

  const addFilter = (field: string, value: string, label: string) => {
    const newFilter: SearchFilter = { field, value, label }
    setFilters(prev => [...prev, newFilter])
  }

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index))
  }

  const clearFilters = () => {
    setFilters([])
  }

  const getSearchDescription = () => {
    if (!searchValue && filters.length === 0) {
      return null
    }

    const parts = []
    
    if (searchValue) {
      parts.push(`"${searchValue}"`)
    }
    
    if (filters.length > 0) {
      const filterText = filters.map(f => `${f.label}: ${f.value}`).join(', ')
      parts.push(filterText)
    }

    return parts.join(' • ')
  }

  return (
    <div className={className}>
      {/* Основная строка поиска */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        <TeamsInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {showFilters && (
            <TeamsButton
              size="sm"
              variant="outline"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`px-2 ${showFilterPanel ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <Filter className="h-4 w-4" />
            </TeamsButton>
          )}

          {clearable && (searchValue || filters.length > 0) && (
            <TeamsButton
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="px-2"
            >
              <X className="h-4 w-4" />
            </TeamsButton>
          )}
        </div>
      </div>

      {/* Описание поиска и количество результатов */}
      {(getSearchDescription() || resultsCount !== undefined) && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-[#605e5c]">
            {getSearchDescription() && (
              <span>Поиск: {getSearchDescription()}</span>
            )}
          </div>
          {resultsCount !== undefined && (
            <div className="text-[#605e5c]">
              Найдено: {resultsCount} {resultsCount === 1 ? 'результат' : resultsCount < 5 ? 'результата' : 'результатов'}
            </div>
          )}
        </div>
      )}

      {/* Панель фильтров */}
      {showFilters && showFilterPanel && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[#323130]">Фильтры</h4>
            {filters.length > 0 && (
              <TeamsButton
                size="sm"
                variant="outline"
                onClick={clearFilters}
              >
                Очистить все
              </TeamsButton>
            )}
          </div>

          {/* Добавление нового фильтра */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <TeamsSelect
              value=""
              onChange={(value) => {
                const option = filterOptions.find(opt => opt.value === value)
                if (option) {
                  addFilter(option.field, '', option.label)
                }
              }}
              options={[
                { value: '', label: 'Добавить фильтр' },
                ...filterOptions.filter(opt => !filters.some(f => f.field === opt.field))
              ]}
            />
          </div>

          {/* Активные фильтры */}
          {filters.length > 0 && (
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                  <span className="text-sm font-medium text-[#323130] min-w-0">
                    {filter.label}:
                  </span>
                  <TeamsInput
                    value={filter.value}
                    onChange={(e) => {
                      const newFilters = [...filters]
                      newFilters[index].value = e.target.value
                      setFilters(newFilters)
                    }}
                    placeholder="Введите значение"
                    className="flex-1"
                  />
                  <TeamsButton
                    size="sm"
                    variant="outline"
                    onClick={() => removeFilter(index)}
                    className="px-2"
                  >
                    <X className="h-3 w-3" />
                  </TeamsButton>
                </div>
              ))}
            </div>
          )}

          {/* Поля поиска */}
          {searchFields.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-[#605e5c] mb-2">
                Поиск по полям: {searchFields.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Хук для поиска с частичными совпадениями
export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  filters: SearchFilter[] = []
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  useEffect(() => {
    let filtered = [...items]

    // Поиск по запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          if (typeof value === 'number') {
            return value.toString().includes(query)
          }
          return false
        })
      })
    }

    // Применение фильтров
    filters.forEach(filter => {
      if (filter.value.trim()) {
        const filterValue = filter.value.toLowerCase()
        filtered = filtered.filter(item => {
          const fieldValue = item[filter.field as keyof T]
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(filterValue)
          }
          if (typeof fieldValue === 'number') {
            return fieldValue.toString().includes(filterValue)
          }
          return false
        })
      }
    })

    setFilteredItems(filtered)
  }, [items, searchQuery, filters, searchFields])

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    resultsCount: filteredItems.length
  }
} 
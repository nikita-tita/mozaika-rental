-- Обновление продакшен базы данных для M² Rental Platform

-- Добавляем колонку features в таблицу properties, если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'features'
    ) THEN
        ALTER TABLE properties ADD COLUMN features TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Добавляем колонку images в таблицу properties, если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'images'
    ) THEN
        ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Проверяем, что все необходимые колонки существуют
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position; 
import { hashPassword, verifyPassword, generateToken, verifyToken, sanitizeUser } from '@/lib/auth'

describe('Auth Module', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123'
      const hashedPassword = await hashPassword(password)
      
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(20)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const role = 'REALTOR'
      
      const token = generateToken(userId, email, role)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const role = 'REALTOR'
      
      const token = generateToken(userId, email, role)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(userId)
      expect(decoded?.email).toBe(email)
      expect(decoded?.role).toBe(role)
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const decoded = verifyToken(invalidToken)
      
      expect(decoded).toBeNull()
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const decoded = verifyToken(invalidToken)
      
      expect(decoded).toBeNull()
    })
  })

  describe('sanitizeUser', () => {
    it('should remove password from user object', () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'REALTOR',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const sanitized = sanitizeUser(user)
      
      expect(sanitized.password).toBeUndefined()
      expect(sanitized.id).toBe(user.id)
      expect(sanitized.email).toBe(user.email)
      expect(sanitized.firstName).toBe(user.firstName)
      expect(sanitized.lastName).toBe(user.lastName)
    })
  })
}) 
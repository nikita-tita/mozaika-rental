import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'

describe('Simple Authentication Integration', () => {
  describe('Password Hashing and Verification', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'testPassword123'
      
      // Hash the password
      const hashedPassword = await hashPassword(password)
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      
      // Verify the password
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject wrong password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword123'
      
      const hashedPassword = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      
      expect(isValid).toBe(false)
    })
  })

  describe('Token Generation and Verification', () => {
    it('should generate and verify token correctly', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const role = 'TENANT'
      
      // Generate token
      const token = generateToken(userId, email, role)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      
      // Verify token
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
  })

  describe('Authentication Flow', () => {
    it('should complete full authentication flow', async () => {
      // Step 1: Hash password
      const password = 'userPassword123'
      const hashedPassword = await hashPassword(password)
      
      // Step 2: Verify password
      const isPasswordValid = await verifyPassword(password, hashedPassword)
      expect(isPasswordValid).toBe(true)
      
      // Step 3: Generate token
      const userId = 'user123'
      const email = 'user@example.com'
      const role = 'TENANT'
      
      const token = generateToken(userId, email, role)
      
      // Step 4: Verify token
      const decoded = verifyToken(token)
      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(userId)
      
      // All steps should work together
      expect(isPasswordValid && decoded).toBeTruthy()
    })
  })
}) 
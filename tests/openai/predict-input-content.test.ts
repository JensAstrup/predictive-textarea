/**
 * @jest-environment node
 */
import 'openai/shims/node'
import OpenAI from 'openai'

import { predictInputContent } from '../../src/openai/predict-input-content'


jest.mock('openai')

describe('predict-input-content', () => {
  const mockCreate = jest.fn()
  const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>

  beforeEach(() => {
    jest.clearAllMocks()

    MockedOpenAI.mockImplementation(() => ({
      responses: {
        create: mockCreate
      }
    } as unknown as OpenAI))

    process.env.OPENAI_API_KEY = 'test-api-key'
    process.env.OPENAI_MODEL = 'test-model'
  })

  afterEach(() => {
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_MODEL
  })

  describe('getClient', () => {
    it('should throw error when OPENAI_API_KEY is not set', async () => {
      delete process.env.OPENAI_API_KEY
      await expect(predictInputContent('test')).rejects.toThrow('OPENAI_API_KEY is not set')
    })

    it('should create OpenAI client with correct API key', async () => {
      mockCreate.mockResolvedValueOnce({ output_text: JSON.stringify({ type: 'prediction', content: 'test' }) })
      await predictInputContent('test')
      expect(MockedOpenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' })
    })
  })

  describe('predictInputContent', () => {
    it('should return predicted content when API returns valid prediction', async () => {
      const expectedContent = ' next words'
      mockCreate.mockResolvedValueOnce({
        output_text: JSON.stringify({
          type: 'prediction',
          content: expectedContent
        })
      })

      const result = await predictInputContent('test input')
      expect(result).toBe(expectedContent)
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'test-model',
        instructions: expect.any(String),
        input: 'Respond in json format. Content: "test input"',
        text: {
          format: {
            type: 'json_object'
          }
        }
      })
    })

    it('should use default model when OPENAI_MODEL is not set', async () => {
      delete process.env.OPENAI_MODEL
      mockCreate.mockResolvedValueOnce({
        output_text: JSON.stringify({
          type: 'prediction',
          content: 'test'
        })
      })

      await predictInputContent('test')
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini'
        })
      )
    })

    it('should reject with error when API returns error type', async () => {
      const errorMessage = 'API error occurred'
      mockCreate.mockResolvedValueOnce({
        output_text: JSON.stringify({
          type: 'error',
          content: errorMessage
        })
      })

      await expect(predictInputContent('test')).rejects.toThrow(errorMessage)
    })

    it('should reject with error when API response is invalid JSON', async () => {
      mockCreate.mockResolvedValueOnce({
        output_text: 'invalid json'
      })

      await expect(predictInputContent('test')).rejects.toThrow()
    })

    it('should reject with "Unknown error" when error content is empty', async () => {
      mockCreate.mockResolvedValueOnce({
        output_text: JSON.stringify({
          type: 'error',
          content: ''
        })
      })

      await expect(predictInputContent('test')).rejects.toThrow('Unknown error')
    })
  })
})

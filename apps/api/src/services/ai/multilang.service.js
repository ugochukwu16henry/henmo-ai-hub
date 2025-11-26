const { OpenAI } = require('openai')

class MultiLanguageService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.supportedLanguages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'yo': 'Yoruba',
      'ig': 'Igbo',
      'ha': 'Hausa'
    }
  }

  async detectLanguage(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Detect the language of the following text. Respond with only the ISO 639-1 language code (e.g., "en", "es", "fr").'
        }, {
          role: 'user',
          content: text
        }],
        max_tokens: 5,
        temperature: 0
      })

      const detectedCode = response.choices[0].message.content.trim().toLowerCase()
      
      return {
        success: true,
        languageCode: detectedCode,
        languageName: this.supportedLanguages[detectedCode] || 'Unknown'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async translateText(text, targetLanguage, sourceLanguage = null) {
    try {
      const targetLangName = this.supportedLanguages[targetLanguage]
      if (!targetLangName) {
        throw new Error(`Unsupported target language: ${targetLanguage}`)
      }

      const systemPrompt = sourceLanguage 
        ? `Translate the following text from ${this.supportedLanguages[sourceLanguage]} to ${targetLangName}.`
        : `Translate the following text to ${targetLangName}.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: systemPrompt
        }, {
          role: 'user',
          content: text
        }],
        temperature: 0.3
      })

      return {
        success: true,
        translatedText: response.choices[0].message.content,
        sourceLanguage,
        targetLanguage,
        targetLanguageName: targetLangName
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async chatInLanguage(messages, language = 'en') {
    try {
      const languageName = this.supportedLanguages[language]
      if (!languageName) {
        throw new Error(`Unsupported language: ${language}`)
      }

      const systemMessage = {
        role: 'system',
        content: `You are HenMo AI, an intelligent assistant. Respond in ${languageName}. Be helpful, accurate, and culturally appropriate.`
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [systemMessage, ...messages],
        temperature: 0.7
      })

      return {
        success: true,
        response: response.choices[0].message.content,
        language,
        languageName
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async localizeContent(content, targetLanguage, context = '') {
    try {
      const targetLangName = this.supportedLanguages[targetLanguage]
      if (!targetLangName) {
        throw new Error(`Unsupported target language: ${targetLanguage}`)
      }

      const systemPrompt = `Localize the following content for ${targetLangName} speakers. Consider cultural context, local expressions, and appropriate tone. ${context ? `Context: ${context}` : ''}`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: systemPrompt
        }, {
          role: 'user',
          content: content
        }],
        temperature: 0.4
      })

      return {
        success: true,
        localizedContent: response.choices[0].message.content,
        targetLanguage,
        targetLanguageName: targetLangName
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  getSupportedLanguages() {
    return Object.entries(this.supportedLanguages).map(([code, name]) => ({
      code,
      name
    }))
  }

  async generateMultilingualResponse(query, languages = ['en']) {
    try {
      const responses = {}
      
      for (const lang of languages) {
        const result = await this.chatInLanguage([{
          role: 'user',
          content: query
        }], lang)
        
        if (result.success) {
          responses[lang] = {
            response: result.response,
            languageName: result.languageName
          }
        }
      }

      return {
        success: true,
        responses,
        query
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new MultiLanguageService()
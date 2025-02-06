import { ImageMessage, LLMConfig, TextMessage } from '../types/llm.types'
import { PromptService } from './promptService'

interface LLMResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
}

interface LLMMessage {
    role: 'system' | 'user' | 'assistant'
    content: (TextMessage | ImageMessage)[]
}

export class LLMService {
    readonly baseUrl: string
    readonly model: string
    readonly token: string
    readonly systemPrompt: string

    constructor(config: LLMConfig) {
        this.baseUrl = `${config.baseUrl}/v1/chat/completions`
        this.model = config.model
        this.token = config.token
        this.systemPrompt = config.systemPrompt
    }

    async execute(prompt: LLMMessage): Promise<string> {
        try {
            const payload = JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: this.systemPrompt
                    },
                    prompt
                ]
            })

            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: payload
            }

            const response = await fetch(this.baseUrl, options)

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const data = (await response.json()) as LLMResponse
            return data.choices[0].message.content
        } catch (error) {
            console.error('LLM execution failed:', error)
            throw new Error('Failed to get response from LLM service')
        }
    }
}


export async function praise(screenshotDataUrl: string): Promise<string> {
    const token = process.env.LLM_API_TOKEN
    if (!token) {
        throw new Error('LLM API token is not set in environment variables')
    }

    const config = PromptService.getPromptConfigById('praisia')
    const systemPrompt = PromptService.generateSystemPrompt(config)

    const llm = new LLMService({
        baseUrl: process.env.LLM_API_BASE_URL || 'https://yunwu.ai',
        token,
        model: 'gemini-2.0-flash',
        systemPrompt
    })

    try {
        return await llm.execute({
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: systemPrompt
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: screenshotDataUrl
                    }
                }
            ]
        })
    } catch (error) {
        console.error('Failed to generate praise:', error)
        throw new Error('Failed to generate praise')
    }
}

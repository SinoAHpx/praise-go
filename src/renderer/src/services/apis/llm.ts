import { LLMConfig } from '@renderer/types/llm.types'
import { log } from 'console'



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

    async execute(prompt: string) {
        const payload = JSON.stringify({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: this.systemPrompt
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })

        log(payload)

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: payload
        }
        const response = await fetch(this.baseUrl, options).then((response) => response.json())

        return response
    }
}
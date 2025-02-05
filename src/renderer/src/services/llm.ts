import { ImageMessage, LLMConfig, TextMessage } from '../types/llm.types'
import prompts from '../config/prompts.json'

type PromptTemplate = (typeof prompts)[number]
type PromptConfig = PromptTemplate['config']

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

    async execute(prompt: TextMessage | ImageMessage) {
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
        const response = await fetch(this.baseUrl, options).then((response) => response.json())

        return response.choices[0].message.content
    }
}

function generateSystemPrompt(config: PromptConfig): string {
    return `# 角色
- ${config.role.description}
- ${config.role.traits.join('\n- ')}

#任务
- ${config.task.main}
${config.task.conditions.map((condition) => `- ${condition.response}（比如${condition.examples.join('、')}等）`).join('\n')}

#规则
${config.rules.map((rule) => `- ${rule}`).join('\n')}

请根据你的<角色>，遵循<规则>完成你的<任务>。`
}

function getPromptConfigById(id: string): PromptConfig {
    const template = prompts.find((p) => p.id === id)
    if (!template) {
        throw new Error(`Prompt template with id "${id}" not found`)
    }
    return template.config
}

export function praise(screenshotDataUrl: string) {
    const token = import.meta.env.VITE_LLM_API_TOKEN
    if (!token) {
        throw new Error('LLM API token is not set in environment variables')
    }
    const llm = new LLMService({
        baseUrl: 'https://api.siliconflow.cn',
        token: token,
        model: 'Qwen/Qwen2-VL-72B-Instruct',
        systemPrompt: generateSystemPrompt(getPromptConfigById('praisia'))
    })

    return llm.execute({
        role: 'user',
        content: [
            {
                type: 'image_url',
                image_url: {
                    url: screenshotDataUrl
                }
            }
        ]
    })
}

export interface LLMConfig {
    baseUrl: string
    model: string
    token: string
    systemPrompt: string
}

export interface TextMessage {
    type: 'text'
    text: string
}

export interface ImageMessage {
    type: 'image_url'
    image_url: {
        url: string
    }
}

export interface PromptConfig {
    role: {
        description: string
        traits: string[]
    }
    task: {
        main: string
        conditions: Array<{
            response: string
            examples: string[]
        }>
    }
    rules: string[]
}

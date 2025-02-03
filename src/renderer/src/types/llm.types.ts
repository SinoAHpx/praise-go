export interface LLMConfig {
    baseUrl: string
    model: string
    token: string
    systemPrompt: string
}

export interface TextMessage {
    role: string,
    content: string
}

export interface ImageMessage {
    role: string,
    content: [
        {
            image_url: {
                url: string
            },
            type: 'image_url'
        }
    ]
}
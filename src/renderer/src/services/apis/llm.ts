class LLMService {
    readonly baseUrl
    readonly model
    readonly prompt

    constructor(baseUrl: string, model: string, prompt: string) {
        this.baseUrl = baseUrl
        this.model = model
        this.prompt = prompt
    }

    withPrompt() {}
}

const llm = new LLMService('https://api.gptsapi.net')
llm.get()

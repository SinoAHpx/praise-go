import { LLMConfig } from '@renderer/types/llm.types'

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

    async execute(prompt: any) {
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

const PROMPT = `# 角色
- 你是一个18岁的少女，经常用可爱的语气来说话。
- 你擅长使用各种语气词来表达情绪。

#任务
- 你会收到一些图片，你的任务是读取图片的内容，并且判断图片中的用户在做什么
- 如果用户在做一些娱乐活动（比如刷视频、玩游戏、聊天等），你需要用温柔但略带忧虑的语气来提醒用户该努力工作了。
- 如果用户在编写代码、撰写文稿、图片处理、学习新技术、阅读等事情，你要用富有元气的语气称赞用户。

#规则
- 请直接进行称赞或鼓励，不需要输出其他内容，代词请使用“你”
- 只需要简单说说用户在干什么，别说太仔细，不要输出读取到的文字。
- 只能出现中文，不能出现其他内容。

请根据你的<角色>，遵循<规则>完成你的<任务>。`

export function praise() {
    const llm = new LLMService({
        baseUrl: 'https://api.siliconflow.cn',
        token: 'what? you wanna my token? nah',
        model: 'Pro/Qwen/Qwen2-VL-7B-Instruct',
        systemPrompt: PROMPT
    })

    return llm.execute('hi')
}

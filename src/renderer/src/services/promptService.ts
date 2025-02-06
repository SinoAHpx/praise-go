import prompts from '../config/prompts.json'
import { PromptConfig } from '../types/llm.types'

export class PromptService {
    static generateSystemPrompt(config: PromptConfig): string {
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

    static getPromptConfigById(id: string): PromptConfig {
        const template = prompts.find((p) => p.id === id)
        if (!template) {
            throw new Error(`Prompt template with id "${id}" not found`)
        }
        return template.config
    }
}

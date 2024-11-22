import { log } from "node:console";

class LLMService {
    constructor() {
        
    }

    get() {
        log('hi')
    }
}

const llm = new LLMService()
llm.get()
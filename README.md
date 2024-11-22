# PraiseGo

The App helps user to stay motivated & productive.

### Specification

- Multiple-platform: Window, Linux and MacOS
- Key features
    - Off-attention detector: alert user when they seems to be distracted.
    - Pomodoro timer: combined with off-attention tracker, each single working session end with a summary of work, subsequented by a regular break session.
    - Daily summary: user end a specific day at specific time, so they can see how productive or opposite they were. Even weekly and monthly summary is of available.
    - Motivation booster: user on-purpose send a request to the App with snapshot picture, then App will praise user’s exertion to help user stay motivated.
    - Different motivation tone: users are able to change their preferred role to motivate them.

### Implementation

- Backend:
    - NexjJs + SQL Lite
- Frontend: Electron + NodeJs + React + Chakra UI + Zustand
- LLM
    - GPT 4o mini
    - Qwen2 VLM 7B
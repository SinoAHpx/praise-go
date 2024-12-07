import { useState, useEffect } from 'react'

export default function Pomodoro({ p }: { p: number }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    
    // 使用 useEffect 来监测进度值
    useEffect(() => {
        if (p >= 100 && !isCompleted) {
            setIsCompleted(true);
        }
    }, [p]);

    // 如果已完成，progress 保持为 0（圆环完整）
    const progress = isCompleted ? 0 : ((100 - p) / 100) * circumference;
    
    // 如果已完成，显示值保持为 100
    const displayValue = isCompleted ? 100 : p;

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-96 h-96">
                <svg
                    className="transform -rotate-90 w-full h-full"
                    viewBox="0 0 220 220"
                >
                    {/* 背景圆 */}
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                    />
                    {/* 进度圆 */}
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={isCompleted ? "text-green-500" : "text-primary"}
                        strokeDasharray={circumference}
                        strokeDashoffset={progress}
                        style={{
                            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease'
                        }}
                    />
                </svg>
                {/* 中间的内容 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isCompleted ? (
                        <svg 
                            className="w-24 h-24 text-green-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
                        <span className="text-4xl font-bold">{displayValue}%</span>
                    )}
                </div>
            </div>
        </div>
    )
}

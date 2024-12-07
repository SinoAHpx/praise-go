import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react'

export default function RadicalProgress({progress}) {
    const [isCompleted, setIsCompleted] = useState(false);
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    
    useEffect(() => {
        if (progress >= 100 && !isCompleted) {
            setIsCompleted(true);
        }
    }, [progress]);

    const p = isCompleted ? 0 : ((100 - progress) / 100) * circumference;
    
    const displayValue = isCompleted ? 100 : progress;

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-96 h-96">
                <svg
                    className="transform -rotate-90 w-full h-full"
                    viewBox="0 0 220 220"
                >
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                    />
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
                        strokeDashoffset={p}
                        style={{
                            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease'
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    {isCompleted ? (
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 text-8xl" />
                    ) : (
                        <span className="text-4xl font-bold">{displayValue}%</span>
                    )}
                </div>
            </div>
        </div>
    )
}

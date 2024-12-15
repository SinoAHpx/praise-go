/**
 * Formats a number of seconds into a time string in the format "MM:SS"
 * @param seconds - The total number of seconds to format
 * @returns A string in the format "MM:SS" where minutes and seconds are padded with leading zeros
 * @example
 * formatTime(65) // returns "01:05"
 * formatTime(3600) // returns "60:00" 
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

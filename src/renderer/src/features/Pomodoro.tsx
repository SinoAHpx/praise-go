import RadicalProgress from "@renderer/components/RadicalProgress";

export default function Pomodoro({ progress }: { progress: number }) {
    return <>
        <RadicalProgress progress={progress}/>
    </>
}

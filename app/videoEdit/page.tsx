import { Metadata } from "next"
import VideoEdit from "./videoEdit"

export const metadata: Metadata = {
    title: "VideoEdit | Jittee Pte ",
}

const VideoEditPage = () => {
    return (
        <VideoEdit/>
    )
}

export default VideoEditPage 
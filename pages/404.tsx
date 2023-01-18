import { IoMdHeartEmpty } from "react-icons/io";

export default function NotFound() {
    return (
        <div className="w-full h-[100vh] bg-white dark:bg-black flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl sm:text-5xl font-bold">
                找不到頁面
                <br />
                <IoMdHeartEmpty className="inline" />
                <span className="text-secondary text-xl">好像不在這裡...</span>
            </h2>
        </div>
    );
}

import { ChineseUI } from "./ChineseUI";
import { Dashboard } from "./Dashboard";
import { RpgSystem } from "./RpgSystem";

export function Features() {
    return (
        <>
            <div className="flex flex-col gap-5 mt-[15rem] text-center">
                <h1 className="heading-xl lg:text-6xl xl:text-7xl">
                    您需要的
                    <span className="text-gradient from-orange-400 to-red-500 block text-7xl sm:inline">
                        所有功能
                    </span>
                    都在這裡
                </h1>
                <h2 className="heading-md text-secondary">
                    從伺服器管理、歡迎消息到音樂播放器和角色扮演系統
                    <br />
                    我們為您的伺服器提供強大的功能
                </h2>
            </div>
            <ChineseUI />
            <RpgSystem />
            <Dashboard />
        </>
    );
}

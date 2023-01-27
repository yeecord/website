import { IoMdHeartEmpty } from "react-icons/io";

export default function NotFound() {
  return (
    <div className="w-full h-[100vh] bg-white dark:bg-black flex flex-col items-center justify-center text-center gap-4">
      <h2 className="text-3xl sm:text-4xl font-bold">找不到頁面</h2>
      <span className="text-secondary text-xl">
        <IoMdHeartEmpty className="inline mr-2" />
        好像不在這裡...
      </span>
    </div>
  );
}

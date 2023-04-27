import { IoMdHeartEmpty } from "react-icons/io";

export default function NotFound() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-4 bg-white text-center dark:bg-black">
      <h2 className="text-3xl font-bold sm:text-4xl">找不到頁面</h2>
      <span className="text-xl text-secondary-light dark:text-secondary-dark">
        <IoMdHeartEmpty className="mr-2 inline" />
        好像不在這裡...
      </span>
    </div>
  );
}

import { AiFillCaretDown } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

type AccordionProps = {
  title: string;
  children?: ReactNode;
};
export function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <motion.header className="rounded-xl mt-4 bg-blue-50 dark:bg-zinc-900">
      <div
        className="h-stack p-4 justify-between cursor-pointer text-black dark:text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className="heading-md">{title}</p>
        <motion.div
          animate={isOpen ? "open" : "collapsed"}
          variants={{
            open: { rotateZ: 180 },
            collapsed: { rotateZ: 0 },
          }}
        >
          <AiFillCaretDown />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="text-secondary"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

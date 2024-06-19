import { useEffect, useState } from "react";

const LoadingPage = ({
  hidden,
  children,
}: {
  hidden: boolean;
  children?: React.ReactNode;
}) => {
  const [elementMounted, setElementMounted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setElementMounted(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [hidden]);
  return (
    <>
      {elementMounted && (
        <div
          className="h-[100vh] w-[100vw] flex justify-center items-center fixed flex-col transition-all bg-[hsl(0,0%,8%)] duration-1000"
          style={{
            opacity: hidden ? 1 : 0,
            zIndex: hidden ? 10 : -10,
          }}
        >
          <h1 className="text-3xl mb-2">Kanban Board</h1>
          <p className="text-xs">loading</p>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default LoadingPage;

import { useRef, useState } from "react";

const CreateProject = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleCreateProject = () => {
    console.log(projectName);
  };
  return (
    <>
      {isCreating ? (
        <form>
          <input
            type="text"
            className="bg-[#191919] w-full p-1 px-2 text-sm outline-none"
            placeholder="Project Name"
            ref={inputRef}
          />
          <div className="w-full flex gap-1 mt-1">
            <button className="text-sm p-1 w-[50%] bg-[#191919] hover:text-emerald-500">
              Add
            </button>
            <button
              className="text-sm p-1 w-[50%] bg-[#191919] hover:text-red-500"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="p-2 text-sm hover:bg-[#191919] text-[#919191] w-full flex items-center gap-1 rounded-sm transition-all"
          draggable="true"
          onClick={() => {
            setIsCreating(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      )}
    </>
  );
};

export default CreateProject;

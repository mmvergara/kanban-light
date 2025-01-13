import { useEffect, useState } from "react";
import supabase from "../supabase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "../context/SessionContext";

const BindingKeyModal = () => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState<null | string>(null);
  const [isKeyRevealed, setIsKeyRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    toast.success("Key copied to clipboard!");
  };

  const handleReset = async () => {
    if (!session.user) return;
    setKey(null);
    setIsKeyRevealed(false);
    const newKey = uuidv4();

    const { error: delError } = await supabase
      .from("binding")
      .delete()
      .eq("owner_id", session.user.id);
    if (delError) {
      console.error(delError);
      toast.error("Could not reset key");
      return;
    }
    const { error } = await supabase
      .from("binding")
      .upsert({ key: newKey, owner_id: session.user.id })
      .eq("owner_id", session.user.id);
    if (error) {
      console.error(error);
      toast.error("The key was deleted, but failed to reset, please try again");
      return;
    }

    toast.success("Key reset successfully");
    setKey(newKey);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsKeyRevealed(false);
  };

  useEffect(() => {
    const fetchKey = async () => {
      if (!session.user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("binding")
        .select("key")
        .eq("owner_id", session.user.id);
      setIsLoading(false);
      if (error) {
        toast.error("Could not fetch key");
        return;
      }
      if (data) {
        setKey(data[0].key);
      }
    };
    fetchKey();
  }, [session]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById("binding-key-modal");
      if (modal && !modal.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs w-fit text-left p-2 rounded-sm mt-1 hover:text-amber-500"
      >
        Binding Keys
      </button>

      {isOpen && (
        <div className="fixed inset-0 w-screen flex items-center justify-center bg-black bg-opacity-70">
          <div
            id="binding-key-modal"
            className="bg-[#202020] p-8 w-full max-w-[500px] drop-shadow-lg"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-emerald-400">
                Binding Key
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-red-600 text-3xl"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 w-[80%] text-white-500 text-sm">
              If there is no key found, click the reset key to generate a new
              key.
            </p>
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={
                    isKeyRevealed
                      ? key || "No key found"
                      : isLoading
                      ? "Loading..."
                      : "Click to reveal key"
                  }
                  readOnly
                  className="bg-[#191919] text-white focus:outline-none p-2 w-full cursor-pointer"
                  onClick={() => setIsKeyRevealed(true)}
                />{" "}
                {isKeyRevealed && (
                  <button
                    onClick={handleCopy}
                    className="p-1 px-2 text-emerald-500 bg-black/30 rounded focus:outline-none"
                  >
                    Copy
                  </button>
                )}
              </div>
              {isKeyRevealed && (
                <p className="text-sm text-amber-600 mt-2">
                  Warning: Do not share this key with anyone; it is unique to
                  your account, and anyone who has access to it can access your
                  data.
                </p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleReset}
                  className="p-1 px-2 text-red-700 hover:text-red-600 bg-black/30 rounded"
                >
                  Reset Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BindingKeyModal;

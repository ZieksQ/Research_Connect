import React, { useState } from "react";
import { patchUserInfo } from "../../services/user";
import { useAuth } from "../../hooks/useAuth";

const EditUserInfo = ({ userData }) => {
  const [username, setUsername] = useState(
    userData?.message?.user_info?.username || "",
  );
  const [school, setSchool] = useState(
    userData?.message?.user_info?.school || "",
  );
  const [program, setProgram] = useState(
    userData?.message?.user_info?.program || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await patchUserInfo({ username, school, program });

      if (!data.ok) {
        setIsLoading(false);
        return;
      }

      await refreshUser();
      setIsLoading(false);
      
      // Close modal after successful update
      const modal = document.getElementById("edit_user_info_modal");
      if (modal) {
        modal.close();
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-primary btn-sm"
        onClick={() =>
          document.getElementById("edit_user_info_modal").showModal()
        }
      >
        Edit
      </button>

      {/* Modal */}
      <dialog id="edit_user_info_modal" className="modal">
        <div className="modal-box">
          <h3 className="mb-4 text-lg font-bold">Edit Profile Information</h3>

          <div className="space-y-4">
            {/* Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* School Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">School</span>
              </label>
              <input
                type="text"
                placeholder="Enter school"
                className="input input-bordered w-full"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>

            {/* Program Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Program</span>
              </label>
              <input
                type="text"
                placeholder="Enter program"
                className="input input-bordered w-full"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button 
              className="btn btn-primary w-34" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-dots loading-md"></span> : "Save Changes"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditUserInfo;

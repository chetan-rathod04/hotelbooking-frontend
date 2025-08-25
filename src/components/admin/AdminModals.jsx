import React from "react";

const AdminModals = () => {
  return (
    <dialog id="admin_modal" className="modal">
      <div className="modal-box bg-white rounded-lg shadow-lg">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Admin Modal</h3>
        <p className="py-2 text-gray-600">
          This is a reusable admin modal component.
        </p>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AdminModals;

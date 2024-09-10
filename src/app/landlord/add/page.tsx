import React from "react";
import AddLandlordForm from "./form";

export default function AddLandlord() {
  return (
    <div className="flex items-center flex-col">
      <h2 className="text-2xl pb-4 font-bold">Add New Landlord</h2>
      <div className="flex justify-center">
        <AddLandlordForm />
      </div>
    </div>
  );
}

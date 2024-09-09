import React from "react";
import AddLandlordForm from "./form";

export default function AddLandlord() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Add New Landlord</h2>
      <div className="px-72">
        <AddLandlordForm />
      </div>
    </div>
  );
}

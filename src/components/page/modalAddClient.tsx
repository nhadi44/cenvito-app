"use client";

import React from "react";
import { FormIinput } from "../formInput";
import { PlusCircleIcon } from "../icons/plusCircle";
import { ModalComponent } from "../modal";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import {
  createCLient,
  fetchClients,
} from "@/app/GlobalRedux/Thunk/clients/clientThunk";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

type ModalAddClientProps = {
  modalId?: string;
  title?: string;
};

export const ModalAddClient = ({ modalId, title }: ModalAddClientProps) => {
  const [formData, setFormData] = React.useState({
    client_name: "",
    event_name: "",
    event_date: "",
    event_type: "",
  });
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmitClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.event_date = new Date(formData.event_date).toISOString();

    let newFormData = {
      ...formData,
      updatedBy: session?.user?.name,
      createdBy: session?.user?.name,
    };

    await dispatch(createCLient(newFormData))
      .unwrap()
      .then((res) => {
        console.log("response", res.status);
        if (res.status === 201) {
          Swal.fire({
            title: "Success",
            text: "Client created successfully",
            icon: "success",
            target: document.getElementById(`${modalId}`),
          }).then(() => {
            dispatch(fetchClients());
            closeModal();
          });
        }
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    (document.getElementById(`${modalId}`) as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
    // clear form data
    setFormData({
      client_name: "",
      event_name: "",
      event_date: "",
      event_type: "",
    });
  };

  return (
    <>
      <button
        className="btn bg-blue-600 text-slate-100 focus:bg-blue-700 hover:bg-blue-700"
        onClick={openModal}
      >
        <PlusCircleIcon />
        <span>{title}</span>
      </button>
      <ModalComponent
        modalId={modalId}
        modalHeader="Add new client"
        modalWrapper="p-0"
        backgroundColorHeader="bg-blue-700 text-white px-6 py-5"
        modalBodyStyle="pt-3 px-6 pb-6"
        closeModal={closeModal}
      >
        <form onSubmit={(e) => handleSubmitClient(e)}>
          <FormIinput
            label="Client Name"
            inputName="client_name"
            inputType="text"
            placeholder="e.g. John Doe"
            labelStyle="text-slate-900 font-semibold text-sm"
            inputStyle="input input-bordered h-10"
            value={formData.client_name}
            onChange={handleInputChange}
            autoFocus={true}
          />
          <div className="mb-1">
            <FormIinput
              label="Event Name"
              inputName="event_name"
              inputType="text"
              labelStyle="text-slate-900 font-semibold text-sm"
              inputStyle="input input-bordered h-10"
              placeholder="e.g. Wedding of John Doe"
              value={formData.event_name}
              onChange={handleInputChange}
              autoFocus={false}
            />
          </div>
          <div className="mb-1">
            <FormIinput
              label="Event Date"
              inputName="event_date"
              inputType="datetime-local"
              labelStyle="text-slate-900 font-semibold text-sm"
              inputStyle="input input-bordered h-10"
              value={formData.event_date}
              onChange={handleInputChange}
              autoFocus={false}
            />
          </div>
          <div className="mb-1">
            <FormIinput
              label="Event Type"
              inputName="event_type"
              inputType="text"
              labelStyle="text-slate-900 font-semibold text-sm"
              inputStyle="input input-bordered h-10"
              placeholder="e.g. Wedding, Birthday, etc."
              value={formData.event_type}
              onChange={handleInputChange}
              autoFocus={false}
            />
          </div>
          <div className="flex items-center justify-end gap-1 mt-4">
            <button
              className="btn bg-slate-300"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button className="btn bg-blue-700 text-white hover:bg-blue-800">
              Submit
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
};
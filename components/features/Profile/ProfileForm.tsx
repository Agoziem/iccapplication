import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ImageUploader from "../../custom/Imageuploader/ImageUploader";
import { converttoformData } from "@/utils/formutils";
import { userDefault } from "@/constants";
import { authAPIendpoint, updateUser } from "@/data/users/fetcher";

const ProfileForm = ({ setAlert, setEditMode }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState(userDefault);

  useEffect(() => {
    if (session) {
      setFormData({
        ...userDefault,
        ...session.user,
        Sex: session.user.sex,
      });
    }
  }, [session]);

  console.log(formData)

  // /

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const modifiedformData = converttoformData(formData);
    if (session) {
      try {
        await updateUser(
          `${authAPIendpoint}/update/${session?.user?.id}/`,
          formData
        );
        setAlert({
          show: true,
          message: `Profile updated successfully, you may need to login again to see the changes, your Data will be preserved.`,
          type: "success",
        });
      } catch (error) {
        setAlert({
          show: true,
          message: "an error occurred while updating your profile",
          type: "danger",
        });
        console.log(error);
      } finally {
        setTimeout(() => {
          setAlert({ show: false, message: "", type: "" });
        }, 3000);
        setEditMode(false);
      }
    }
  };

  return (
    <div>
      <div className="card p-4 p-md-4 mx-auto" style={{ maxWidth: "600px" }}>
        <form className="px-2" onSubmit={handleSubmit}>
          <div>
            <i
              className="bi bi-x h3 text-primary float-end"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setEditMode(false);
              }}
            ></i>
            <h4 className="text-center">edit Profile</h4>
            <p className="text-center">Edit your profile information</p>
          </div>

          <hr />
          {/* custom picture uploader */}
          <div className="form-profile">
            {/* display the image or the icon */}
            <div>
              <ImageUploader
                imagekey={"avatar"}
                imageurlkey={"avatar_url"}
                imagename={"avatar_name"}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>

          {/* firstname */}
          <div className="row mt-2">
            <div className="col-12 col-md-6 mb-4">
              <label
                htmlFor="first_name"
                className="form-label text-primary fw-bold"
              >
                Firstname
              </label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                placeholder="first name ..."
                value={formData.first_name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, first_name: e.target.value });
                }}
              />
            </div>

            {/* lastname */}
            <div className="col-12 col-md-6 mb-4">
              <label
                htmlFor="last_name"
                className="form-label text-primary fw-bold"
              >
                Lastname
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                placeholder="full name ..."
                value={formData.last_name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, last_name: e.target.value });
                }}
              />
            </div>

            {/* Gender */}
            <div className="col-12 col-md-6 mb-2">
              <p className="text-primary fw-bold mb-0">Gender</p>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked={formData.Sex === "male"}
                  value="male"
                  onChange={(e) => {
                    setFormData({ ...formData, Sex: e.target.value });
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked={formData.Sex === "female"}
                  value="female"
                  onChange={(e) => {
                    setFormData({ ...formData, Sex: e.target.value });
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  female
                </label>
              </div>
            </div>

            {/* email */}
            <div className="col-12 col-md-6 mb-4">
              <label
                htmlFor="email"
                className="form-label text-primary fw-bold"
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                value={formData.email || ""}
                readOnly
              />
            </div>

            {/* Phone number */}
            <div className="col-12 col-md-6 mb-4">
              <label
                htmlFor="Phonenumber"
                className="form-label text-primary fw-bold"
              >
                <i className="bi bi-telephone-fill me-2"></i> Phone number
              </label>
              <input
                type="text"
                className="form-control"
                id="Phonenumber"
                placeholder="your Phonenumber"
                value={formData.phone || ""}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                }}
              />
            </div>

            {/* Phone number */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="text" className="form-label text-primary fw-bold">
                <i className="bi bi-geo-alt-fill me-2"></i> Address
              </label>
              <input
                type="text"
                className="form-control"
                id="text"
                placeholder="enter your Address"
                value={formData.address || ""}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="d-flex flex-md-row justify-content-end flex-column flex-md-fill my-3">
            <button
              className="btn btn-secondary rounded me-0 mb-3 me-md-2 mb-md-0"
              onClick={() => setEditMode(false)}
            >
              cancel
            </button>
            <button className="btn btn-primary rounded" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

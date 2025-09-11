import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";

/**
 * @param {{ addStaff: any; addorupdate: any; staff: Staff; setStaff: (value:Staff) => void; closeModal: any;loading:boolean }} param0
 */
const StaffForm = ({
  addStaff,
  addorupdate,
  staff,
  setStaff,
  closeModal,
  loading,
}) => {
  return (
    <form onSubmit={addStaff}>
      <div className="mb-3">
        <ImageUploader
          imagekey={"img"}
          imageurlkey={"img_url"}
          imagename={"img_name"}
          formData={staff}
          setFormData={setStaff}
        />
      </div>
      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            value={staff.first_name}
            onChange={(e) => setStaff({ ...staff, first_name: e.target.value })}
            required
          />
        </div>
        <div className="col-md">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            value={staff.last_name}
            onChange={(e) => setStaff({ ...staff, last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="other_names" className="form-label">
            Other Names
          </label>
          <input
            type="text"
            className="form-control"
            id="other_names"
            value={staff.other_names}
            onChange={(e) =>
              setStaff({ ...staff, other_names: e.target.value })
            }
          />
        </div>

        <div className="col-md">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={staff.email}
            onChange={(e) => setStaff({ ...staff, email: e.target.value })}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={staff.phone}
            onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
          />
        </div>
        <div className="col-md">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={staff.address}
            onChange={(e) => setStaff({ ...staff, address: e.target.value })}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <input
            type="text"
            className="form-control"
            id="role"
            value={staff.role}
            onChange={(e) => setStaff({ ...staff, role: e.target.value })}
            required
          />
        </div>
        <div className="col-md">
          <label htmlFor="facebooklink" className="form-label">
            Facebook Link
          </label>
          <input
            type="text"
            className="form-control"
            id="facebooklink"
            value={staff.facebooklink}
            onChange={(e) =>
              setStaff({ ...staff, facebooklink: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="instagramlink" className="form-label">
            Instagram Link
          </label>
          <input
            type="text"
            className="form-control"
            id="instagramlink"
            value={staff.instagramlink}
            onChange={(e) =>
              setStaff({ ...staff, instagramlink: e.target.value })
            }
          />
        </div>
        <div className="col-md">
          <label htmlFor="twitterlink" className="form-label">
            Twitter Link
          </label>
          <input
            type="text"
            className="form-control"
            id="twitterlink"
            value={staff.twitterlink}
            onChange={(e) =>
              setStaff({ ...staff, twitterlink: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md">
          <label htmlFor="linkedinlink" className="form-label">
            LinkedIn Link
          </label>
          <input
            type="text"
            className="form-control"
            id="linkedinlink"
            value={staff.linkedinlink}
            onChange={(e) =>
              setStaff({ ...staff, linkedinlink: e.target.value })
            }
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-accent-secondary border-0 rounded me-2"
          onClick={() => closeModal()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary border-0 rounded" disabled={loading}>
          {loading ? "submitting" : addorupdate.mode === "add" ? "Add" : "Update"}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;

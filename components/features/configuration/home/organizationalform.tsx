import ImageUploader from '@/components/custom/Imageuploader/ImageUploader'
import React from 'react'


/**
 * @param {{ handleSubmit: any; OrganizationData: Organization; setOrganizationData: (value:Organization) => void; setEditMode: any; }} param0
 */
const OrganizationalForm = ({handleSubmit,OrganizationData,setOrganizationData,setEditMode}) => {
  return (
    <form onSubmit={handleSubmit}>
    <div className="form-group mb-4">
      <label htmlFor="name" className="mb-2 fw-bold text-primary ">
        Organization Name
      </label>
      <input
        type="text"
        className="form-control"
        id="name"
        value={OrganizationData.name}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            name: e.target.value,
          })
        }
      />
    </div>
    <div className="form-group mb-3">
      <label
        htmlFor="description"
        className="mb-2 fw-bold text-primary"
      >
        Organization Description
      </label>
      <textarea
        className="form-control"
        id="description"
        value={OrganizationData.description}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            description: e.target.value,
          })
        }
        rows={5}
      ></textarea>
    </div>
    <div className="form-group mb-4">
      <label htmlFor="vision" className="mb-2 fw-bold text-primary">
        Organization Vision
      </label>
      <textarea
        className="form-control"
        id="vision"
        value={OrganizationData.vision}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            vision: e.target.value,
          })
        }
        rows={3}
      ></textarea>
    </div>
    <div className="form-group mb-4">
      <label htmlFor="mission" className="mb-2 fw-bold text-primary">
        Organization Mission
      </label>
      <textarea
        className="form-control"
        id="mission"
        value={OrganizationData.mission}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            mission: e.target.value,
          })
        }
        rows={3}
      ></textarea>
    </div>
    <div className="form-group mb-4">
      <label htmlFor="email" className="mb-2 fw-bold text-primary">
        Organization Email
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        value={OrganizationData.email}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            email: e.target.value,
          })
        }
      />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="phone" className="mb-2 fw-bold text-primary">
        Organization Official line
      </label>
      <input
        type="tel"
        className="form-control"
        id="phone"
        value={OrganizationData.phone}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            phone: e.target.value,
          })
        }
      />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="address" className="mb-2 fw-bold text-primary">
        Organization Address
      </label>
      <input
        type="text"
        className="form-control"
        id="address"
        value={OrganizationData.address}
        onChange={(e) =>
          setOrganizationData({
            ...OrganizationData,
            address: e.target.value,
          })
        }
      />
    </div>
    <div className="form-group mb-4">
      <ImageUploader
        imageurlkey={"Organizationlogo"}
        imagekey={"logo"}
        imagename={"Organizationlogoname"}
        formData={OrganizationData}
        setFormData={setOrganizationData}
      />
    </div>

    <div className="d-flex flex-md-row flex-column flex-md-fill mt-3">
      <button
        className="btn btn-accent-secondary me-0 me-md-3 mb-3 mb-md-0"
        onClick={() => setEditMode(false)}
      >
        cancel
      </button>
      <button type="submit" className="btn btn-primary border-0">
        Save Changes
      </button>
    </div>
  </form>
  )
}

export default OrganizationalForm
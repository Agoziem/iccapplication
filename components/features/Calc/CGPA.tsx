import React, { useState } from "react";
import { BsCalculator } from "react-icons/bs";
import { TiTimes } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";

const CGPA = () => {
  const [courses, setCourses] = useState([
    {
      _id: uuidv4(),
      CourseCode: "",
      CreditUnit: "",
      Grade: "",
    },
  ]);
  const [cgpa, setCGPA] = useState(0);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setCourses((prev) => {
      return prev.map((course) => {
        if (course._id === id) {
          return { ...course, [name]: value };
        }
        return course;
      });
    });
  };

  //   ----------------------------------
  //   add course
  //  ----------------------------------
  const addCourse = () => {
    setCourses([
      ...courses,
      {
        _id: uuidv4(),
        CourseCode: "",
        CreditUnit: "",
        Grade: "",
      },
    ]);
  };

  // ----------------------------------
  // calculate CGPA function
  // ----------------------------------
  const calculateCGPA = () => {
    let totalCreditUnit = 0;
    let totalGradePoint = 0;

    courses.forEach((course) => {
      totalCreditUnit += Number(course.CreditUnit);
      totalGradePoint += Number(course.CreditUnit) * Number(course.Grade);
    });

    const cgpa = totalGradePoint / totalCreditUnit;
    setCGPA(cgpa.toFixed(3));
  };

  //   ----------------------------------
  //  reset form
  //  ----------------------------------
  const resetForm = () => {
    setCourses([
      {
        _id: uuidv4(),
        CourseCode: "",
        CreditUnit: "",
        Grade: "",
      },
    ]);
    setCGPA(0);
  };

  return (
    <div className="my-3">
      <div className="card p-4 py-4 mx-auto my-3" style={{ maxWidth: "700px" }}>
        <div className="text-center">
          <BsCalculator
            className="mb-3"
            style={{
              color: "var(--primary)",
              fontSize: "3.5rem",
              transform: "rotate(45deg)",
            }}
          />
        </div>
        <h3 className="text-center">CGPA Calculator</h3>
        <p className="my-1 text-center">
          This CGPA Calculator is based on the Nigeria University grading system
        </p>
        <hr />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateCGPA();
          }}
        >
          {/* Courses */}
          <div className="px-2">
            <div className="d-flex justify-content-start mt-2 mx-0">
              <div className="text-primary fw-bold text-center flex-fill">
                <div></div> Course Code
              </div>
              <div className="text-primary fw-bold text-center flex-fill">
                Credit Unit
              </div>
              <div className="text-primary fw-bold text-center flex-fill">
                Grade
              </div>
            </div>

            {courses.map((course, index) => (
              <div
                key={course._id}
                className="d-flex justify-content-around align-items-center my-3 mb-5"
              >
                <div className="text-center fw-bold me-3">
                  <h5>{index + 1}</h5>
                </div>
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Course Code"
                  value={course.CourseCode}
                  onChange={(e) => {
                    handleChange(e, course._id);
                  }}
                  name="CourseCode"
                  required
                />
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="Credit Unit"
                  value={course.CreditUnit}
                  onChange={(e) => {
                    handleChange(e, course._id);
                  }}
                  name="CreditUnit"
                  required
                />

                <select
                  className="form-select"
                  value={course.Grade}
                  onChange={(e) => {
                    handleChange(e, course._id);
                  }}
                  name="Grade"
                  required
                >
                  <option value="">Grade</option>
                  <option value="5">A</option>
                  <option value="4">B</option>
                  <option value="3">C</option>
                  <option value="2">D</option>
                  <option value="1">E</option>
                  <option value="0">F</option>
                </select>

                <div className="mb-0">
                  <TiTimes
                    className="ms-2 text-danger h4"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const newCourses = courses.filter(
                        (c) => c._id !== course._id
                      );
                      setCourses(newCourses);
                    }}
                  />
                </div>
              </div>
            ))}

            {/* buttons */}
            <hr />
            <div className="d-flex flex-md-row flex-column flex-md-fill">
              <button
                className="btn btn-primary rounded me-0 me-md-3 "
                onClick={() => {
                  addCourse();
                }}
              >
                Add Course
              </button>

              <button
                className="btn btn-secondary rounded mt-3 mt-md-0 me-0 me-md-3 "
                onClick={() => {
                  resetForm();
                }}
              >
                Reset form
              </button>

              <button
                className="btn btn-success rounded mt-3 mt-md-0"
                type="submit"
              >
                Calculate your CGPA
              </button>
            </div>

            {/* Total CGPA */}
            <hr />
            <div>
              <h4 className="text-center">Your CGPA is: {cgpa}</h4>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CGPA;

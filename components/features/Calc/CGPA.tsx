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
  const [cgpa, setCGPA] = useState("0");
  const [calculationError, setCalculationError] = useState("");

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setCalculationError(""); // Clear any previous errors
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
  // calculate CGPA function with validation
  // ----------------------------------
  const calculateCGPA = () => {
    try {
      setCalculationError("");

      // Validate courses
      const validCourses = courses.filter(course => 
        course.CourseCode.trim() && 
        course.CreditUnit.trim() && 
        course.Grade.trim()
      );

      if (validCourses.length === 0) {
        setCalculationError("Please add at least one complete course entry");
        return;
      }

      let totalCreditUnit = 0;
      let totalGradePoint = 0;

      for (const course of validCourses) {
        const creditUnit = Number(course.CreditUnit);
        const grade = Number(course.Grade);

        // Validate numeric values
        if (isNaN(creditUnit) || creditUnit <= 0 || creditUnit > 6) {
          setCalculationError(`Invalid credit unit for ${course.CourseCode}. Must be between 1 and 6.`);
          return;
        }

        if (isNaN(grade) || grade < 0 || grade > 5) {
          setCalculationError(`Invalid grade for ${course.CourseCode}. Please select a valid grade.`);
          return;
        }

        totalCreditUnit += creditUnit;
        totalGradePoint += creditUnit * grade;
      }

      // Check for division by zero
      if (totalCreditUnit === 0) {
        setCalculationError("Total credit units cannot be zero");
        return;
      }

      const calculatedCGPA = totalGradePoint / totalCreditUnit;
      
      // Validate result
      if (!isFinite(calculatedCGPA)) {
        setCalculationError("Invalid CGPA calculation result");
        return;
      }

      setCGPA(calculatedCGPA.toFixed(3));
    } catch (error) {
      setCalculationError("An error occurred during calculation. Please check your inputs.");
      console.error("CGPA calculation error:", error);
    }
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
    setCGPA("0");
    setCalculationError("");
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
                  maxLength={10}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="Credit Unit (1-6)"
                  value={course.CreditUnit}
                  onChange={(e) => {
                    handleChange(e, course._id);
                  }}
                  name="CreditUnit"
                  min="1"
                  max="6"
                  step="1"
                />

                <select
                  className="form-select"
                  value={course.Grade}
                  onChange={(e) => {
                    handleChange(e, course._id);
                  }}
                  name="Grade"
                >
                  <option value="">Grade</option>
                  <option value="5">A (5.0)</option>
                  <option value="4">B (4.0)</option>
                  <option value="3">C (3.0)</option>
                  <option value="2">D (2.0)</option>
                  <option value="1">E (1.0)</option>
                  <option value="0">F (0.0)</option>
                </select>

                <div className="mb-0">
                  <TiTimes
                    className="ms-2 text-danger h4"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // Prevent deleting the last course
                      if (courses.length > 1) {
                        const newCourses = courses.filter(
                          (c) => c._id !== course._id
                        );
                        setCourses(newCourses);
                      }
                    }}
                  />
                </div>
              </div>
            ))}

            {/* buttons */}
            <hr />

            {/* Error Message */}
            {calculationError && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {calculationError}
              </div>
            )}

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
              {cgpa !== "0" && (
                <div className="text-center mt-2">
                  <small className="text-muted">
                    {parseFloat(cgpa) >= 4.5 && "First Class"}
                    {parseFloat(cgpa) >= 3.5 && parseFloat(cgpa) < 4.5 && "Second Class Upper"}
                    {parseFloat(cgpa) >= 2.4 && parseFloat(cgpa) < 3.5 && "Second Class Lower"}
                    {parseFloat(cgpa) >= 1.5 && parseFloat(cgpa) < 2.4 && "Third Class"}
                    {parseFloat(cgpa) < 1.5 && "Pass"}
                  </small>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CGPA;

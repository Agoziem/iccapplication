import React, { useState } from "react";
import { BsCalculator } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import AggregatorInst from "./AggregatorInst";

const Aggregator = () => {
  const [scores, setScores] = useState({
    jamb: "",
    postUTME: "",
  });
  const [aggregate, setAggregate] = useState(0);
  const [olevel, setOlevel] = useState([
    {
      id: uuidv4(),
      subject: "",
      grade: "",
    },
    {
      id: uuidv4(),
      subject: "",
      grade: "",
    },
    {
      id: uuidv4(),
      subject: "",
      grade: "",
    },
    {
      id: uuidv4(),
      subject: "",
      grade: "",
    },
    {
      id: uuidv4(),
      subject: "",
      grade: "",
    },
  ]);

  const [showOlevelForm, setShowOlevelForm] = useState(false);
  const [showPostUTMEForm, setShowPostUTMEForm] = useState(false);
  const [isPostUTMEOver100, setIsPostUTMEOver100] = useState(true);

  //   ----------------------------------
  //   set scores
  //  ----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores((prev) => {
      return { ...prev, [name]: value };
    });
  };

  //   ----------------------------------
  //   calculate aggregate function
  //   ----------------------------------
  const calculateAggregate = () => {
    const jamb = Number(scores.jamb);
    let aggregateScore = 0;

    if (showPostUTMEForm) {
      const postUTME = Number(scores.postUTME);
      if (isPostUTMEOver100) {
        aggregateScore = jamb / 8 + postUTME / 2;
      } else {
        aggregateScore = jamb / 8 + postUTME / 8;
      }
    } else if (showOlevelForm) {
      const olevelScore = olevel.reduce((acc, curr) => {
        return acc + Number(getGradePoint(curr.grade));
      }, 0);
      aggregateScore = jamb / 8 + olevelScore;
    }

    setAggregate(aggregateScore.toFixed(2));
  };

  //   ----------------------------------
  //   reset form
  //  ----------------------------------
  const reset = () => {
    setScores({
      jamb: "",
      postUTME: "",
    });
    setAggregate(0);
    setOlevel([
      {
        id: uuidv4(),
        subject: "",
        grade: "",
      },
      {
        id: uuidv4(),
        subject: "",
        grade: "",
      },
      {
        id: uuidv4(),
        subject: "",
        grade: "",
      },
      {
        id: uuidv4(),
        subject: "",
        grade: "",
      },
      {
        id: uuidv4(),
        subject: "",
        grade: "",
      },
    ]);
  };

  // get the equivalent grade point for each subject, based on if the post-utme is included or not
  const getGradePoint = (grade) => {
    if (grade === "A1") {
      return showPostUTMEForm ? 4.0 : 10;
    } else if (grade === "B2") {
      return showPostUTMEForm ? 3.6 : 9;
    } else if (grade === "B3") {
      return showPostUTMEForm ? 3.2 : 8;
    } else if (grade === "C4") {
      return showPostUTMEForm ? 2.8 : 7;
    } else if (grade === "C5") {
      return showPostUTMEForm ? 2.4 : 6;
    } else if (grade === "C6") {
      return showPostUTMEForm ? 2.0 : 5;
    }
  };

  // handle toggling of PostUTME form
  const handlePostUTMEToggle = () => {
    setShowPostUTMEForm(!showPostUTMEForm);
    if (!showPostUTMEForm) {
      setShowOlevelForm(false);
    }
    setScores((prev) => ({
      ...prev,
      postUTME: "",
    }));
  };

  // handle toggling of Olevel form
  const handleOlevelToggle = () => {
    setShowOlevelForm(!showOlevelForm);
    if (!showOlevelForm) {
      setShowPostUTMEForm(false);
    }
  };

  return (
    <div className="my-3">
      <div className="container">
        <div className="row">
          <AggregatorInst />
          <div className="col-12 col-md-5">
            <div className="card px-5 py-5">
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
              <h5 className="text-center mb-3">Calculate Your Aggregate</h5>
              <hr />
              {/* Jamb Input */}
              <div className="form-group">
                <label htmlFor="jamb">JAMB Score</label>
                <input
                  type="number"
                  id="jamb"
                  name="jamb"
                  value={scores.jamb}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Toggle PostUTME form */}
              <div className="form-check my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showPostUTMEForm}
                  onChange={handlePostUTMEToggle}
                  id="togglePostUTME"
                />
                <label className="form-check-label" htmlFor="togglePostUTME">
                  Use PostUTME
                </label>
              </div>

              {/* PostUTME Input */}
              {showPostUTMEForm && (
                <div className="form-group">
                  <label htmlFor="postUTME">PostUTME Score</label>
                  <input
                    type="number"
                    id="postUTME"
                    name="postUTME"
                    value={scores.postUTME}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {/* Checkbox for PostUTME Score Type */}
                  <div className="form-check my-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isPostUTMEOver100}
                      onChange={() => setIsPostUTMEOver100(!isPostUTMEOver100)}
                      id="postUTMEOver100"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="postUTMEOver100"
                    >
                      PostUTME score is over 100
                    </label>
                  </div>
                </div>
              )}

              {/* Toggle Olevel form */}
              <div className="form-check my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showOlevelForm}
                  onChange={handleOlevelToggle}
                  id="toggleOlevel"
                />
                <label className="form-check-label" htmlFor="toggleOlevel">
                  Use Olevel
                </label>
              </div>

              {/* Olevel Inputs */}
              {showOlevelForm &&
                olevel.map((item, index) => (
                  <div
                    className="form-group d-flex justify-content-between mb-2"
                    key={item.id}
                  >
                    <div>
                      <label htmlFor={`subject${index}`}>
                        Subject {index + 1}
                      </label>
                      <input
                        type="text"
                        id={`subject${index}`}
                        value={item.subject}
                        onChange={(e) =>
                          setOlevel((prev) =>
                            prev.map((sub, i) =>
                              i === index
                                ? { ...sub, subject: e.target.value }
                                : sub
                            )
                          )
                        }
                        className="form-control"
                      />
                    </div>

                    <div className="flex-fill ms-3">
                      <label htmlFor={`grade${index}`}>Grade</label>
                      <select
                        id={`grade${index}`}
                        value={item.grade}
                        onChange={(e) =>
                          setOlevel((prev) =>
                            prev.map((sub, i) =>
                              i === index
                                ? {
                                    ...sub,
                                    grade: e.target.value,
                                  }
                                : sub
                            )
                          )
                        }
                        className="form-select"
                      >
                        <option value="">Grade</option>
                        <option value="A1">A1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="C4">C4</option>
                        <option value="C5">C5</option>
                        <option value="C6">C6</option>
                      </select>
                    </div>
                  </div>
                ))}

              {/* Calculate and Reset Buttons */}
              <div className="d-flex flex-md-row flex-column flex-md-fill my-3">
                <button
                  className="btn btn-primary me-0 me-md-3 mb-3 mb-md-0 rounded"
                  onClick={calculateAggregate}
                >
                  <BsCalculator className="me-2" />
                  Calculate
                </button>
                <button className="btn btn-secondary rounded" onClick={reset}>
                  <MdRefresh className="me-2" />
                  Reset
                </button>
              </div>
              
              {/* Display Aggregate Score */}
              <hr />
              <h4 className="mt-3">Aggregate Score: {aggregate}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aggregator;

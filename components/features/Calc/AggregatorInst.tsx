import React from "react";

const AggregatorInst: React.FC = () => {
  return (
    <div className="col-12 col-md-7 px-3 px-md-5 py-2 py-md-4">
      {/* Introduction */}
      <div>
        <h4
          className="mb-2"
          style={{
            lineHeight: "2.3rem",
          }}
        >
          What is &ldquo;Aggregate Score&rdquo; for University Admissions?
        </h4>
        <p>
          An aggregate score (or cumulative score), is a calculated numerical
          representation of a student’s academic performance and qualifications.
          Universities and colleges use aggregate scores as a key criterion for
          admission to undergraduate programs. The aggregate score takes into
          account various factors, including your secondary school exam results
          (O’levels), your JAMB UTME result, and sometimes additional components
          like post-UTME exams or screening excercise. Since the introduction of
          JAMB CAPS, every school is required to make JAMB score weigh at least
          50% of the total aggregate score of their candidates. The purpose of
          an aggregate score is to provide a holistic assessment of a student’s
          academic abilities and potential. It helps admission committees
          compare applicants fairly and select candidates who are best suited
          for their programs.
        </p>
      </div>
      <hr className="py-2" />
      {/* Steps to Calc Aggregate */}
      <div>
        <h4
          className="mb-2 text-wrap text-break"
          style={{
            lineHeight: "2.3rem",
          }}
        >
          <span
            className="badge bg-secondary-light text-secondary me-3"
            style={{
              border: "1px solid var(--secondary)",
            }}
          >
            Step 1
          </span>
          Gather the required Information
        </h4>
        <p>
          Before you can calculate your aggregate score, you need to collect the
          necessary information, which typically includes:
        </p>
        <ol>
          <li>
            <span className="me-2 fw-bold" style={{ color: "var(--primary)" }}>
              Secondary School Results:
            </span>
            Obtain your final exam results, such as your West African Senior
            School Certificate Examination (WASSCE), Senior Secondary
            Certificate Examination (SSCE), or equivalent.
          </li>
          <li>
            <span className="me-2 fw-bold" style={{ color: "var(--primary)" }}>
              Subject Relevance:
            </span>
            Determine the relevant subjects needed to study your intended
            course. This information is often provided by the university or
            college you’re applying to.
          </li>

          <li>
            <span className="me-2 fw-bold" style={{ color: "var(--primary)" }}>
              Grading System:
            </span>
            Understand the grading system used for your secondary school exams.
            Typically, this includes letter grades (e.g., A, B, C) and
            corresponding grade points (e.g., 10, 9, 8).
          </li>
        </ol>
      </div>

      <hr className="py-2" />
      {/* Weac Grade Points */}
      <div>
        <h4
          className="mb-2 text-wrap text-break"
          style={{
            lineHeight: "2.3rem",
          }}
        >
          <span
            className="badge bg-secondary-light text-secondary me-3"
            style={{
              border: "1px solid var(--secondary)",
            }}
          >
            Step 2
          </span>
          O&apos;level Grade Points
        </h4>
        <p>
          Assign grade points to your secondary school exam results based on the
          grading system. For example, for institutions that calculate aggregate
          score without post-UTME.
        </p>
        <div className="card p-3 overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" colSpan={2}>
                  WITHOUT POST-UTME
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GRADE</td>
                <td>GRADE POINT</td>
              </tr>
              <tr>
                <td>A1</td>
                <td>10 Points</td>
              </tr>
              <tr>
                <td>B2</td>
                <td>9 Points</td>
              </tr>
              <tr>
                <td>B3</td>
                <td>8 Points</td>
              </tr>
              <tr>
                <td>C4</td>
                <td>7 Points</td>
              </tr>
              <tr>
                <td>C5</td>
                <td>6 Points</td>
              </tr>
              <tr>
                <td>C6</td>
                <td>5 Points</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr className="py-2" />
      {/* Post-UTME Exam */}
      <div>
        <h4
          className="mb-2 text-wrap text-break"
          style={{
            lineHeight: "2.3rem",
          }}
        >
          <span
            className="badge bg-secondary-light text-secondary me-3"
            style={{
              border: "1px solid var(--secondary)",
            }}
          >
            Step 3
          </span>
          Post-UTME Exam or Screening
        </h4>
        <p>
          If your intended university or college conducts a Post-UTME exam or
          screening exercise, obtain your Post-UTME score. If no Post-UTME exams
          are conducted, your secondary school exam results and JAMB score will
          be used to calculate your aggregate score.
        </p>
      </div>

      <hr className="py-2" />
      {/* Calculate Aggregate Score */}
      <div>
        <h4
          className="mb-2 text-wrap text-break"
          style={{
            lineHeight: "2.3rem",
          }}
        >
          <span
            className="badge bg-secondary-light text-secondary me-3"
            style={{
              border: "1px solid var(--secondary)",
            }}
          >
            Step 4
          </span>
          Calculate Aggregate Score
        </h4>
        <p>Use the following formula to calculate your aggregate score:</p>
        <p>
          <strong>For Institutions without Post-UTME:</strong>
        </p>
        <p>
          <strong>
            Aggregate Score = (JAMB Score / 8) + (O’Level Grade Points)
          </strong>
        </p>
        <p>
          <strong>For Institutions with Post-UTME:</strong>
        </p>
        <p>
          <strong>
            Aggregate Score = (JAMB Score / 8) + (Post-UTME Score / 2){" "}
            <span className="fw-light">
              {`{if Post-UTME score is over 100}`}
            </span>{" "}
          </strong>
        </p>
        <p>
          <strong>
            Aggregate Score = (JAMB Score / 8) + (Post-UTME Score / 8){" "}
            <span className="fw-light">
              {`{if Post-UTME score is over 400}`}
            </span>{" "}
          </strong>
        </p>
      </div>
      <hr className="py-2" />
      {/* Important Note */}
      <div>
        <h4 className="mb-2 text-wrap text-break">Important Note:</h4>
        <p>
          The specific calculation method and weightings may vary depending on
          the institution and the course of study. Be sure to check the
          admission guidelines provided by the university or college to which
          you are applying.
        </p>
      </div>
    </div>
  );
};

export default AggregatorInst;

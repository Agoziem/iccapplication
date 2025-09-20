"use client";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import StarRating from "@/components/custom/StarRating/StarRating";
import ReusableSwiper from "@/components/custom/Swiper/ReusableSwiper";
import "./section.css";
import { useTestimonials } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

const CustomSwiper = () => {
   // for fetching testimonials
  const { data: testimonials } = useTestimonials(
    parseInt(ORGANIZATION_ID || "0")
  )
  return (
    <>
      <section id="testimonials" className="testimonials p-3 pb-4 p-md-5">
        <div className="mb-4 px-3 px-md-5">
          <h6>Testimonials</h6>
          <h4>Hear what our Clients are Saying</h4>
        </div>

        <ReusableSwiper noItemsMessage="No Reviews yet">
          {testimonials &&
            testimonials.results?.length > 0 &&
            testimonials.results?.map((testimonial) => (
              <div key={testimonial.id} className="card p-4" style={{
                minHeight: "210px",
              }} >
                <div className="card-body">
                  <div>
                    <BiSolidQuoteAltRight
                      className="float-end text-primary"
                      style={{ fontSize: "35px" }}
                    />
                  </div>
                  <p className="card-text">{testimonial.content}</p>
                  <div className="d-flex align-items-center">
                    {testimonial.img ? (
                      <img
                        src={testimonial.img_url}
                        alt="testimonial"
                        className="img-fluid rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle text-white d-flex justify-content-center align-items-center"
                        style={{
                          width: 75,
                          height: 75,
                          fontSize: "30px",
                          backgroundColor: "var(--bgDarkerColor)",
                        }}
                      >
                        {testimonial.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ms-3">
                      <h6 className="mb-1">{testimonial.name}</h6>
                      <p className="my-0 small">{testimonial.role}</p>
                      <StarRating rating={Number(testimonial.rating || "0")} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </ReusableSwiper>
      </section>
    </>
  );
};

export default CustomSwiper;

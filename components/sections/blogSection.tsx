"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import "./section.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { articleAPIendpoint, fetchArticles } from "@/data/hooks/articles.hooks";
import { useFetchArticles } from "@/data/hooks/articles.hooks";
import AnimationContainer from "@/components/animation/animation-container";

const BlogSection = () => {
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  // ----------------------------------------------------------
  // fetch articles by Categories
  // ----------------------------------------------------------
const { data: articles } = useFetchArticles(
  `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=All&page=1&page_size=3`
)

  return (
    <>
      <hr className="text-primary pt-4 mx-5" />
      <section className="blog-section px-4 px-md-5">
        <div className=" blog-text text-center d-flex flex-column align-items-center mb-4">
          <h2>Articles and news</h2>
          <p className="align-self-center">
            Get the latest news and updates on our blog, stay informed and never
            miss out on any important information.
          </p>
        </div>

        <div className="row px-3 px-md-5">
          {articles && articles.results.length > 0 ? (
            articles.results.map((blog,index) => (
              <AnimationContainer
                slideDirection="down"
                delay={0.1 * index}
                key={blog.id}
                className="col-12 col-md d-flex justify-content-center"
              >
                <div className="card mx-auto" style={{ width: "350px" }}>
                  <div
                    className="blog-image"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "200px",
                    }}
                  >
                    {blog.img ? (
                      <img
                        src={blog.img_url}
                        className="object-fit-cover me-3"
                        alt="profile"
                        style={{
                          objectPosition: "top center",
                          width: "100%",
                          height: "100%",
                          borderRadius: "0.5rem 0.5rem 0 0",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center me-3"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "var(--bgDarkColor)",
                          color: "var(--bgDarkerColor)",
                          fontSize: "5rem",
                          borderRadius: "0.5rem 0.5rem 0 0",
                        }}
                      >
                        <MdOutlineArticle />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-center">
                      <h6 className="text-primary mb-2">{blog.title}</h6>
                      <p className="mb-1 small ">
                        {blog.subtitle.length > 100
                          ? blog.subtitle.slice(0, 100) + "..."
                          : blog.subtitle}
                      </p>
                    </div>
                    <div
                      className="d-flex justify-content-center my-3 text-primary"
                      style={{ fontSize: "1rem" }}
                    >
                      <Link
                        href={`/articles/${blog.slug}`}
                        className="mx-2 fw-medium text-primary bg-primary-light px-3 py-2 rounded"
                        style={{ cursor: "pointer" }}
                      >
                        Read more <FaLongArrowAltRight className="ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimationContainer>
            ))
          ) : (
            <div className="col-12 d-flex justify-content-center">
              <p
                className="p-3 text-primary text-center bg-primary-light mt-1 mb-3 rounded"
                style={{ minWidth: "300px" }}
              >
                No Articles yet
              </p>
            </div>
          )}
        </div>

        {articles?.count > 3 && (
          <div>
            <div className="d-flex justify-content-center mt-0 mb-5">
              <Link href="/articles" className="btn btn-primary px-5">
                View articles
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogSection;

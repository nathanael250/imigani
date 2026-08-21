import { FileText } from 'lucide-react'
import akageraImage from '../assets/Destinations/akagera.png'

const articles = []

function Blog() {
  return (
    <>
      <section className="blog-hero relative isolate flex min-h-[215px] items-center overflow-hidden px-5 text-white">
        <img src={akageraImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.78),rgba(117,78,23,0.46),rgba(7,24,11,0.32))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[46px] font-bold leading-tight sm:text-[56px]">Blog</h1>
          <span className="mt-2 block h-[4px] w-[78px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="blog-section bg-white px-5 py-[76px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-[720px]">
            <p className="blog-kicker">STORIES & INSIGHTS</p>
            <h2 className="blog-title">From East Africa, With Stories</h2>
            <p className="blog-intro">
              Discover travel inspiration, destination guides, wildlife stories, cultural insights, and useful
              advice for exploring East Africa.
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="blog-grid">
              {articles.map((article) => (
                <article className="blog-card" key={article.title}>
                  <a className="blog-card-image" href="#" aria-label={article.title}>
                    <img src={article.image} alt={article.alt} />
                  </a>
                  <div className="blog-card-body">
                    <p className="blog-card-meta">{article.meta}</p>
                    <h3>
                      <a href="#">{article.title}</a>
                    </h3>
                    <p className="blog-card-excerpt">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 flex min-h-[320px] flex-col items-center justify-center rounded-[10px] border border-[#d7e2d5] bg-white px-6 py-14 text-center shadow-[0_18px_45px_rgba(10,35,17,0.08)]">
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f0e8] text-[var(--deep-green)]">
                <FileText className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="text-[28px] font-bold leading-tight text-[var(--deep-green)]">No blog posts yet</h3>
              <p className="mt-3 max-w-[520px] text-[15px] font-bold leading-7 text-[#627064]">
                There are no blog stories created in the database right now. Once posts are added, they will appear
                here for visitors to read.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog

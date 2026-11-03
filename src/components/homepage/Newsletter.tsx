import { type FormEvent } from "react";
const Newsletter = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <section className="page-width content-section">
      <div className="newsletter">
        <div><h2>Get décor ideas, new arrivals &amp; exclusive offers.</h2><p>Join 50,000+ happy customers. No spam, ever.</p></div>
        <form onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Enter your email address" required />
          <button className="button button-dark" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;


const TrustedBy = () => {
  return (
    <section className="page-width trusted-by">
      <p>As Seen On / Trusted By 50,000+ Happy Customers</p>
      <div>{["Amazon", "Flipkart", "Pepperfry", "Croma", "Meesho", "AJIO", "Myntra"].map((name) => <span key={name}>{name}</span>)}</div>
    </section>
  );
}

export default TrustedBy;
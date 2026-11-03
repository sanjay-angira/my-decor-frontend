import { Icon } from "@/components/Icon";

const SectionHeading = ({ title, href = "#featured", id }: { title: string; href?: string; id?: string }) => {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      <a className="view-all" href={href}>View All <Icon name="arrow" /></a>
    </div>
  );
}

export default SectionHeading;
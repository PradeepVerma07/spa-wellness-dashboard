import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="reveal mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-serif text-4xl leading-tight text-charcoal md:text-6xl">{title}</h2>
        {text && <p className="mt-4 max-w-2xl text-base leading-8 text-charcoal/68">{text}</p>}
      </div>
      {href && action && (
        <Link href={href} className="outline-button inline-flex w-fit px-5 py-3 text-sm font-semibold">
          {action}
        </Link>
      )}
    </div>
  );
}

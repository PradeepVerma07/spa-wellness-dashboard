import { PageHero } from "@/components/PageHero";

export function PolicyPage({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        text="Clear terms help every guest plan with confidence."
        image="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="section-pad">
        <div className="container-pad max-w-3xl">
          <div className="soft-card p-6 md:p-8">
            <div className="grid gap-5">
              {items.map((item) => (
                <p key={item} className="text-base leading-8 text-charcoal/70">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

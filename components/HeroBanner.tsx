import Image from "next/image";

export default function HeroBanner({ src }: { src: string }) {
  return (
    <figure className="mb-10 overflow-hidden rounded-2xl border border-ink/10 shadow-soft">
      <div className="relative aspect-[21/9] w-full bg-chocolate-deep sm:aspect-[2.4/1]">
        <Image
          src={src}
          alt="The bookshelf"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div className="hero-vignette absolute inset-0" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-chocolate-deep/70 to-transparent px-5 pb-4 pt-10">
          <figcaption className="font-display text-lg text-parchment/95 sm:text-xl">
            The bookshelf
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

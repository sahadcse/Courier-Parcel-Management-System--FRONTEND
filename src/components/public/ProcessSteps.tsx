'use client';

import Image from 'next/image';

export default function ProcessSteps() {
  const steps = [
    { num: 1, title: 'ORDER', description: 'Duis autem vel eum iriure hendrerit in vulputate.' },
    { num: 2, title: 'WAIT', description: 'Duis autem vel eum iriure hendrerit in vulputate.' },
    { num: 3, title: 'DELIVER', description: 'Duis autem vel eum iriure hendrerit in vulputate.' },
  ];

  return (
    <section className="relative h-full py-12 w-full overflow-hidden bg-gray-900 text-white md:h-[300px]">
      {/* Background City Image */}
      <Image
        src="https://images.unsplash.com/photo-1575380591643-b2c92368dc6d"
        alt="City at night"
        fill
        quality={80}
        className="object-cover object-center opacity-60" // Reduced opacity for text readability
      />
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Top Yellow Bar */}
      <div className="absolute left-0 right-0 top-0 h-0.5 max-w-[80%] mx-auto bg-yellow-500"></div>

      {/* Delivery Van Image */}
      {/* Positioned absolutely to the right, adjusting for different screen sizes */}

      <div className="absolute bottom-0 right-0 z-10 h-[150px] w-[250px] md:h-[200px] md:w-[350px] lg:h-[225px] lg:w-[400px]">
        <Image
          src="/img/DeliveryVanSide.png"
          alt="Delivery Van"
          fill
          quality={100}
          className=" object-right object-contain"
        />
      </div>

      {/* Steps Content */}
      <div className="container relative z-20 mx-auto h-full px-4">
        <div className="grid h-full grid-cols-1 items-center gap-8 md:grid-cols-4">
          {steps.map(step => (
            <div key={step.num} className="z-10 text-left flex gap-3 items-center">
              {' '}
              {/* Added md:w-2/3 to keep text from overlapping van */}
              <p className="text-3xl font-extrabold text-white md:text-4xl">{step.num}.</p>
              <div>
                <h3 className="mt-2 text-xl font-bold uppercase md:text-2xl">{step.title}</h3>
                <p className="mt-1 text-base text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

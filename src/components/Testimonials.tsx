'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    initials: 'PM',
    name: 'Priya & Arjun Mehta',
    location: '2500 sq ft · Whitefield, Bangalore',
    text: 'We were nervous about renovating our 2500 sq ft home in Whitefield — it felt overwhelming. Design Dwellers not only made it easy, they delivered 3 days ahead of schedule. Every single detail was exactly as we\'d imagined. We\'ve had more compliments on our home in the last month than in the 5 years we lived here before.',
  },
  {
    initials: 'VR',
    name: 'Vikram Reddy',
    location: '1800 sq ft · Gachibowli, Hyderabad',
    text: 'I\'ve worked with 3 interior designers before Design Dwellers. None of them came close. The 3D renders were so accurate — what I saw on screen is exactly what I got. And the 45-day timeline? They did it in 41.',
  },
  {
    initials: 'SI',
    name: 'Sunita Iyer',
    location: 'Modular Kitchen · JP Nagar, Bangalore',
    text: 'The modular kitchen they designed is something straight out of a magazine. Premium finish, smart storage, and it\'s been 2 years with zero issues. Worth every rupee.',
  },
];

export default function Testimonials() {
  return (
    <section className="w-full" style={{ background: '#FFFFFF', paddingTop: '71px', paddingBottom: '80px' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
        {/* Section header */}
        <motion.div
          className="relative"
          style={{ width: '220px', height: '19px', marginBottom: '10px' }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            Client Stories
          </span>
          <div className="absolute" style={{ left: '92px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </motion.div>

        {/* Title + subtitle */}
        <motion.div
          className="flex justify-between items-end mb-[60px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="font-heading"
            style={{
              fontSize: '48px',
              lineHeight: '1.17em',
              color: '#141300',
              WebkitTextStroke: '0.5px #141300',
              maxWidth: '455px',
            }}
          >
            500+ Happy Families Can&apos;t Be Wrong
          </h2>
          <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#141300', maxWidth: '398px' }}>
            Real reviews. Unfiltered. From homeowners just like you.
          </p>
        </motion.div>

        {/* 3 Cards */}
        <div className="flex gap-[40px]">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.3 } }}
              style={{
                width: '402px',
                height: '265px',
                background: '#141300',
                borderRadius: '22px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Quote mark */}
              <span
                className="font-body"
                style={{
                  fontSize: '64px',
                  lineHeight: '1em',
                  color: '#D7A648',
                  position: 'absolute',
                  top: '25px',
                  left: '31px',
                  WebkitTextStroke: '1px #D7A648',
                }}
              >
                &ldquo;
              </span>

              {/* Review text */}
              <p
                className="font-body"
                style={{
                  fontSize: '12px',
                  lineHeight: '1em',
                  color: '#FFFFFF',
                  textAlign: 'right',
                  position: 'absolute',
                  top: '76px',
                  left: '34px',
                  width: '342px',
                  height: '72px',
                  overflow: 'hidden',
                }}
              >
                {t.text}
              </p>

              {/* Gold separator */}
              <div
                style={{
                  position: 'absolute',
                  top: '177px',
                  left: '248px',
                  width: '128px',
                  height: '1px',
                  background: '#D7A648',
                }}
              />

              {/* Avatar */}
              <div
                className="flex items-center justify-center"
                style={{
                  position: 'absolute',
                  top: '196px',
                  left: '34px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(146deg, rgba(216,166,72,1) 11%, rgba(114,88,38,1) 95%)',
                }}
              >
                <span className="font-heading" style={{ fontSize: '20px', lineHeight: '1.17em', color: '#FFFFFF' }}>
                  {t.initials}
                </span>
              </div>

              {/* Stars */}
              <div style={{ position: 'absolute', top: '198px', left: '94px' }}>
                <Image src="/images/star-rating.svg" alt="5 stars" width={50} height={10} />
              </div>

              {/* Name */}
              <h4
                className="font-heading"
                style={{
                  position: 'absolute',
                  top: '208px',
                  left: '94px',
                  fontSize: '16px',
                  lineHeight: '1.17em',
                  color: '#D7A648',
                  WebkitTextStroke: '0.5px #D7A648',
                }}
              >
                {t.name}
              </h4>

              {/* Location */}
              <p
                className="font-body"
                style={{
                  position: 'absolute',
                  top: '234px',
                  left: '94px',
                  fontSize: '7px',
                  lineHeight: '1em',
                  color: '#FFFFFF',
                  textAlign: 'right',
                }}
              >
                {t.location}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-[53px]">
          <Image src="/images/testimonial-nav.svg" alt="" width={82} height={9} />
        </div>
      </div>
    </section>
  );
}

'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePagedScroller } from '@/hooks/usePagedScroller';

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
  {
    initials: 'AK',
    name: 'Ananya & Karan Shah',
    location: '3BHK · Indiranagar, Bangalore',
    text: 'Their team made our compact 3BHK feel open, warm, and incredibly organized. Every storage idea is used daily.',
  },
  {
    initials: 'RG',
    name: 'Rohit Gupta',
    location: 'Living Room · HSR Layout, Bangalore',
    text: 'The living room finally feels like us. Clean execution, calm communication, and no surprise costs.',
  },
  {
    initials: 'NK',
    name: 'Neha Krishnan',
    location: 'Full Home · Kondapur, Hyderabad',
    text: 'From design sign-off to handover, the process was smooth. The final finish matched the renders beautifully.',
  },
  {
    initials: 'AS',
    name: 'Amit & Sneha Rao',
    location: 'Villa Interior · Sarjapur Road',
    text: 'They balanced premium materials with practical choices. Our villa looks elegant but still easy to live in.',
  },
  {
    initials: 'DR',
    name: 'Divya Raman',
    location: 'Wardrobes · Koramangala, Bangalore',
    text: 'The wardrobe planning was excellent. Every inch has a purpose, and the finish still looks brand new.',
  },
  {
    initials: 'MJ',
    name: 'Meera Joseph',
    location: 'Kitchen & Dining · Jubilee Hills',
    text: 'Our kitchen and dining space became the best part of the home. The layout is beautiful and genuinely practical.',
  },
];

const REVIEW_PAGE_SIZE = 3;

export default function Testimonials() {
  const reviewPageCount = Math.ceil(testimonials.length / REVIEW_PAGE_SIZE);
  const {
    activeIndex,
    handleClickCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleScroll,
    handleWheel,
    scrollRef,
    scrollToIndex,
  } = usePagedScroller({
    itemCount: reviewPageCount,
  });

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

        {/* Review cards */}
        <div
          ref={scrollRef}
          onClickCapture={handleClickCapture}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onScroll={handleScroll}
          onWheel={handleWheel}
          className="flex gap-[40px] no-scrollbar"
          style={{
            cursor: 'grab',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            overscrollBehaviorX: 'contain',
            touchAction: 'auto',
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          aria-label={`Client review carousel, page ${activeIndex + 1} of ${reviewPageCount}`}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              data-testimonial-card
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
                flex: '0 0 402px',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
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
        <ReviewPaginationDots pageCount={reviewPageCount} activeIndex={activeIndex} onPageChange={scrollToIndex} />
      </div>
    </section>
  );
}

function ReviewPaginationDots({
  pageCount,
  activeIndex,
  onPageChange,
}: {
  pageCount: number;
  activeIndex: number;
  onPageChange: (index: number) => void;
}) {
  return (
    <div className="flex justify-center mt-[53px]" role="tablist" aria-label="Client review pages">
      <div className="flex items-center" style={{ gap: '17px' }}>
        {Array.from({ length: pageCount }, (_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Show client reviews page ${index + 1}`}
              aria-selected={isActive}
              role="tab"
              onClick={() => onPageChange(index)}
              style={{
                width: isActive ? '9px' : '6px',
                height: isActive ? '9px' : '6px',
                borderRadius: '999px',
                border: 'none',
                background: '#D7A648',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';

const faqItems = [
  'What is the starting price for a full home interior?',
  'How long does a project take from start to finish?',
  'Do you handle civil work and false ceilings too?',
  'Can I customise designs to match my taste?',
  'Do you offer EMI or financing options?',
  'Will I get a dedicated designer for my project?',
  'What cities do you currently serve?',
];

const expandedAnswer =
  'Yes, we currently serve Kolkata, Howrah, and nearby areas within West Bengal. We are expanding to other cities soon. Contact us to check availability in your area.';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(6);

  return (
    <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="max-w-[1440px] mx-auto px-[80px] flex gap-[60px]">
        {/* Left side - header + CTA */}
        <div className="flex flex-col" style={{ width: '460px', flexShrink: 0 }}>
          {/* Tag */}
          <div className="relative" style={{ width: '268px', height: '19px', marginBottom: '10px' }}>
            <span
              className="font-heading absolute"
              style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
            >
              Common Questions
            </span>
            <div className="absolute" style={{ left: '140px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
          </div>

          <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '16px' }}>
            Questions? We&apos;ve Got Answers.
          </h2>

          <p className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#FFFFFF', opacity: 0.7, marginBottom: '30px' }}>
            Everything you need to know before getting started. Still have questions? We&apos;re one call away.
          </p>

          <button
            className="font-heading flex items-center justify-center"
            style={{
              background: '#D7A648',
              borderRadius: '55px',
              width: '260px',
              height: '44px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Still have Questions? Talk to us
          </button>
        </div>

        {/* Right side - accordion cards */}
        <div className="flex-1 flex flex-col gap-[4px]">
          {faqItems.map((question, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="relative cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: isOpen ? '20px 40px 20px 24px' : '0 40px 0 24px',
                  height: isOpen ? 'auto' : '65px',
                  minHeight: '65px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648' }}>
                    {question}
                  </span>
                  {/* Toggle icon */}
                  <span
                    className="font-heading"
                    style={{
                      fontSize: '24px',
                      lineHeight: '1em',
                      color: '#D7A648',
                      flexShrink: 0,
                      marginLeft: '12px',
                      userSelect: 'none',
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#000000', marginTop: '12px' }}>
                    {expandedAnswer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

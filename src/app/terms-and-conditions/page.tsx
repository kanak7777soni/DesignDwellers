import Footer from '@/components/Footer';
import GlowEffects from '@/components/GlowEffects';
import { getActiveLegalSections, getSiteContentData } from '@/lib/content-store';

function Lines({ text }: { text: string }) {
  return text.split('\n').map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

export const dynamic = 'force-dynamic';

export default async function TermsAndConditionsPage() {
  const content = await getSiteContentData();
  const sections = getActiveLegalSections(content.legal);

  return (
    <main className="terms-page min-h-screen" style={{ background: '#141300', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
      <GlowEffects glows={[
        { top: -220, left: 1050, width: 628, height: 633 },
        { top: 720, left: -160, width: 628, height: 633 },
      ]} />

      <section className="relative max-w-[1440px] mx-auto" style={{ padding: '180px 80px 80px' }}>
        <div className="flex items-center gap-[8px]" style={{ marginBottom: '10px' }}>
          <span className="font-heading" style={{ fontSize: '16px', lineHeight: '1.17em', color: '#D7A648' }}>
            {content.legal.label}
          </span>
          <div style={{ width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        <div className="flex justify-between items-end" style={{ marginBottom: '42px' }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', marginBottom: '16px' }}>
              <Lines text={content.legal.heading} />
            </h1>
            <p className="font-body" style={{ fontSize: '16px', lineHeight: '1.5em', color: '#FFFFFF', opacity: 0.7, maxWidth: '620px' }}>
              Company Name: {content.legal.companyName}<br />
              GST: {content.legal.gstNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '24px' }}>
          {sections.map((section) => (
            <section key={section.title} style={{ background: '#000000', borderRadius: '8px', padding: '26px 28px' }}>
              <h2 className="font-heading" style={{ fontSize: '24px', lineHeight: '1.17em', color: '#D7A648', marginBottom: '14px' }}>
                {section.title}
              </h2>
              <div className="flex flex-col" style={{ gap: '10px' }}>
                {section.body.map((item) => (
                  <p key={item} className="font-body" style={{ fontSize: '16px', lineHeight: '1.45em', color: '#FFFFFF', opacity: 0.82 }}>
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
import AdminHeader from '@/components/admin/AdminHeader';
import SubmitButton from '@/components/admin/SubmitButton';
import UploadAwareForm from '@/components/admin/UploadAwareForm';
import {
  saveAboutAction,
  saveBrandsAction,
  saveGlobalSeoAction,
  saveLegalAction,
} from '@/app/admin/content/actions';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getSiteContentData,
  type AboutStudioCard,
  type AboutTeamMember,
  type AboutTimelineItem,
  type BrandPartner,
  type LegalSection,
} from '@/lib/content-store';
import { hasImageKitUploadConfig } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

const inputStyle = {
  height: '42px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '0 12px',
  outline: 'none',
};

const compactInputStyle = {
  ...inputStyle,
  height: '36px',
  padding: '0 10px',
};

const fileInputStyle = {
  ...inputStyle,
  height: '46px',
  paddingTop: '9px',
};

const textAreaStyle = {
  minHeight: '120px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '12px',
  outline: 'none',
  resize: 'vertical' as const,
};

function statusText(status?: string) {
  if (status === 'seo-saved') return 'Global SEO saved.';
  if (status === 'brands-saved') return 'Brand partners saved.';
  if (status === 'about-saved') return 'About page content saved.';
  if (status === 'legal-saved') return 'Terms & Policy content saved.';
  return null;
}

function errorText(error?: string) {
  if (error === 'upload') return 'Upload failed. Please use an image file or paste a direct image URL.';
  if (error === 'storage') return 'CRM storage could not save. Check the private Blob token configuration.';
  return null;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
      {label}
      {children}
      {hint ? (
        <span style={{ color: 'rgba(255,255,255,0.58)', fontSize: '12px', lineHeight: '1.35em' }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ background: '#000000', border: '1px solid rgba(215,166,72,0.25)', borderRadius: '8px', padding: '24px' }}>
      <div style={{ marginBottom: '18px' }}>
        <h2 className="font-heading" style={{ fontSize: '32px', color: '#FFFFFF' }}>
          {title}
        </h2>
        {intro ? (
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', lineHeight: '1.4em', marginTop: '6px' }}>
            {intro}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PreviewImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="font-body flex items-center justify-center" style={{ width: '96px', height: '66px', borderRadius: '6px', background: '#141300', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
        Empty
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: '96px', height: '66px', objectFit: 'contain', borderRadius: '6px', background: '#FFFFFF', padding: '6px' }}
    />
  );
}

function rowKey(item: { id?: string } | undefined, fallback: string) {
  return item?.id || fallback;
}

function formatStats(stats: { value: string; label: string }[]) {
  return stats.map((stat) => `${stat.value}|${stat.label}`).join('\n');
}

function formatValues(values: { num: string; title: string; desc: string }[]) {
  return values.map((value) => `${value.num}|${value.title}|${value.desc}`).join('\n');
}

function addBlankRows<T>(items: T[], count: number) {
  return [
    ...items,
    ...Array.from({ length: count }, () => undefined),
  ] as Array<T | undefined>;
}

function BrandRows({ items }: { items: BrandPartner[] }) {
  const rows = addBlankRows(items, 3);

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {rows.map((item, index) => {
        const key = rowKey(item, `new-brand-${index}`);

        return (
          <div key={key} className="grid items-center" style={{ gridTemplateColumns: '46px 96px 92px minmax(120px,1fr) minmax(180px,1.4fr) 140px 92px 80px 80px 72px', gap: '10px', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '12px' }}>
            <input type="hidden" name="brandIndexes" value={key} />
            <input type="hidden" name={`brandId-${key}`} value={item?.id || ''} />
            <input type="hidden" name={`brandLogoStorage-${key}`} value={item?.logoStorage ? JSON.stringify(item.logoStorage) : ''} />
            <label className="font-body flex items-center justify-center" style={{ gap: '6px', color: '#FFFFFF', fontSize: '12px' }}>
              <input type="checkbox" name={`brandActive-${key}`} defaultChecked={item?.active ?? true} />
              On
            </label>
            <PreviewImage src={item?.type === 'logo' ? item.logoSrc : ''} alt={item?.alt || 'Brand logo'} />
            <select name={`brandType-${key}`} defaultValue={item?.type || 'logo'} className="font-body" style={compactInputStyle}>
              <option value="logo">Logo</option>
              <option value="text">Text</option>
            </select>
            <input name={`brandLabel-${key}`} defaultValue={item?.label || ''} placeholder="Brand name" className="font-body" style={compactInputStyle} />
            <input name={`brandLogoSrc-${key}`} defaultValue={item?.logoSrc || ''} placeholder="Logo URL or upload" className="font-body" style={compactInputStyle} />
            <input name={`brandLogoFile-${key}`} type="file" accept="image/*" className="font-body" style={{ ...compactInputStyle, paddingTop: '6px' }} />
            <input name={`brandAlt-${key}`} defaultValue={item?.alt || ''} placeholder="Alt text" className="font-body" style={compactInputStyle} />
            <input name={`brandWidth-${key}`} type="number" defaultValue={item?.width || 146} className="font-body number-input-clean" style={compactInputStyle} />
            <input name={`brandHeight-${key}`} type="number" defaultValue={item?.height || (item?.type === 'text' ? 72 : 146)} className="font-body number-input-clean" style={compactInputStyle} />
            <input name={`brandSortOrder-${key}`} type="number" defaultValue={item?.sortOrder ?? (index + 1) * 10} className="font-body number-input-clean" style={compactInputStyle} />
          </div>
        );
      })}
    </div>
  );
}

function StudioRows({ items }: { items: AboutStudioCard[] }) {
  const rows = addBlankRows(items, 2);

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {rows.map((item, index) => {
        const key = rowKey(item, `new-studio-${index}`);

        return (
          <div key={key} className="grid items-center" style={{ gridTemplateColumns: '46px 96px minmax(160px,1fr) minmax(200px,1.1fr) minmax(180px,1.1fr) 140px minmax(120px,0.8fr) 72px', gap: '10px', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '12px' }}>
            <input type="hidden" name="studioIndexes" value={key} />
            <input type="hidden" name={`studioId-${key}`} value={item?.id || ''} />
            <input type="hidden" name={`studioImageStorage-${key}`} value={item?.imageStorage ? JSON.stringify(item.imageStorage) : ''} />
            <label className="font-body flex items-center justify-center" style={{ gap: '6px', color: '#FFFFFF', fontSize: '12px' }}>
              <input type="checkbox" name={`studioActive-${key}`} defaultChecked={item?.active ?? true} />
              On
            </label>
            <PreviewImage src={item?.imageSrc} alt={item?.alt || 'Studio photo'} />
            <input name={`studioTitle-${key}`} defaultValue={item?.title || ''} placeholder="Card title" className="font-body" style={compactInputStyle} />
            <input name={`studioSubtitle-${key}`} defaultValue={item?.subtitle || ''} placeholder="Studio address/year line" className="font-body" style={compactInputStyle} />
            <input name={`studioImageSrc-${key}`} defaultValue={item?.imageSrc || ''} placeholder="Image URL or upload" className="font-body" style={compactInputStyle} />
            <input name={`studioImageFile-${key}`} type="file" accept="image/*" className="font-body" style={{ ...compactInputStyle, paddingTop: '6px' }} />
            <input name={`studioAlt-${key}`} defaultValue={item?.alt || ''} placeholder="Alt text" className="font-body" style={compactInputStyle} />
            <input name={`studioSortOrder-${key}`} type="number" defaultValue={item?.sortOrder ?? (index + 1) * 10} className="font-body number-input-clean" style={compactInputStyle} />
          </div>
        );
      })}
    </div>
  );
}

function TimelineRows({ items }: { items: AboutTimelineItem[] }) {
  const rows = addBlankRows(items, 3);

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {rows.map((item, index) => {
        const key = rowKey(item, `new-timeline-${index}`);

        return (
          <div key={key} className="grid items-start" style={{ gridTemplateColumns: '46px 60px 84px minmax(180px,1fr) minmax(260px,1.5fr) 72px', gap: '10px', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '12px' }}>
            <input type="hidden" name="timelineIndexes" value={key} />
            <input type="hidden" name={`timelineId-${key}`} value={item?.id || ''} />
            <label className="font-body flex items-center" style={{ gap: '6px', color: '#FFFFFF', fontSize: '12px', paddingTop: '9px' }}>
              <input type="checkbox" name={`timelineActive-${key}`} defaultChecked={item?.active ?? true} />
              On
            </label>
            <input name={`timelineYear-${key}`} defaultValue={item?.year || ''} placeholder="24" className="font-body" style={compactInputStyle} />
            <select name={`timelineSide-${key}`} defaultValue={item?.side || 'right'} className="font-body" style={compactInputStyle}>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
            <input name={`timelineTitle-${key}`} defaultValue={item?.title || ''} placeholder="Timeline title" className="font-body" style={compactInputStyle} />
            <textarea name={`timelineDesc-${key}`} defaultValue={item?.desc || ''} placeholder="Timeline description" className="font-body" style={{ ...textAreaStyle, minHeight: '74px' }} />
            <input name={`timelineSortOrder-${key}`} type="number" defaultValue={item?.sortOrder ?? (index + 1) * 10} className="font-body number-input-clean" style={compactInputStyle} />
          </div>
        );
      })}
    </div>
  );
}

function TeamRows({ items }: { items: AboutTeamMember[] }) {
  const rows = addBlankRows(items, 2);

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {rows.map((item, index) => {
        const key = rowKey(item, `new-team-${index}`);

        return (
          <div key={key} className="grid items-start" style={{ gridTemplateColumns: '46px 96px minmax(130px,0.8fr) minmax(150px,0.8fr) minmax(220px,1.2fr) minmax(180px,1fr) 140px minmax(110px,0.7fr) 72px', gap: '10px', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '12px' }}>
            <input type="hidden" name="teamIndexes" value={key} />
            <input type="hidden" name={`teamId-${key}`} value={item?.id || ''} />
            <input type="hidden" name={`teamImageStorage-${key}`} value={item?.imageStorage ? JSON.stringify(item.imageStorage) : ''} />
            <label className="font-body flex items-center" style={{ gap: '6px', color: '#FFFFFF', fontSize: '12px', paddingTop: '9px' }}>
              <input type="checkbox" name={`teamActive-${key}`} defaultChecked={item?.active ?? true} />
              On
            </label>
            <PreviewImage src={item?.imageSrc} alt={item?.alt || 'Team member'} />
            <input name={`teamName-${key}`} defaultValue={item?.name || ''} placeholder="Name" className="font-body" style={compactInputStyle} />
            <input name={`teamRole-${key}`} defaultValue={item?.role || ''} placeholder="Role" className="font-body" style={compactInputStyle} />
            <textarea name={`teamDesc-${key}`} defaultValue={item?.desc || ''} placeholder="Short bio" className="font-body" style={{ ...textAreaStyle, minHeight: '74px' }} />
            <input name={`teamImageSrc-${key}`} defaultValue={item?.imageSrc || ''} placeholder="Image URL or upload" className="font-body" style={compactInputStyle} />
            <input name={`teamImageFile-${key}`} type="file" accept="image/*" className="font-body" style={{ ...compactInputStyle, paddingTop: '6px' }} />
            <input name={`teamAlt-${key}`} defaultValue={item?.alt || ''} placeholder="Alt text" className="font-body" style={compactInputStyle} />
            <input name={`teamSortOrder-${key}`} type="number" defaultValue={item?.sortOrder ?? (index + 1) * 10} className="font-body number-input-clean" style={compactInputStyle} />
          </div>
        );
      })}
    </div>
  );
}

function LegalRows({ items }: { items: LegalSection[] }) {
  const rows = addBlankRows(items, 2);

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {rows.map((item, index) => {
        const key = rowKey(item, `new-legal-${index}`);

        return (
          <div key={key} className="grid items-start" style={{ gridTemplateColumns: '46px minmax(220px,0.9fr) minmax(380px,1.5fr) 72px', gap: '10px', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: index === 0 ? 0 : '12px' }}>
            <input type="hidden" name="legalIndexes" value={key} />
            <input type="hidden" name={`legalId-${key}`} value={item?.id || ''} />
            <label className="font-body flex items-center" style={{ gap: '6px', color: '#FFFFFF', fontSize: '12px', paddingTop: '9px' }}>
              <input type="checkbox" name={`legalActive-${key}`} defaultChecked={item?.active ?? true} />
              On
            </label>
            <input name={`legalTitle-${key}`} defaultValue={item?.title || ''} placeholder="Section title" className="font-body" style={compactInputStyle} />
            <textarea name={`legalBody-${key}`} defaultValue={item?.body.join('\n') || ''} placeholder="One paragraph per line" className="font-body" style={{ ...textAreaStyle, minHeight: '94px' }} />
            <input name={`legalSortOrder-${key}`} type="number" defaultValue={item?.sortOrder ?? (index + 1) * 10} className="font-body number-input-clean" style={compactInputStyle} />
          </div>
        );
      })}
    </div>
  );
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await requireAdmin();
  const data = await getSiteContentData();
  const { status, error } = await searchParams;
  const message = statusText(status);
  const errorMessage = errorText(error);
  const clientUploadsEnabled = hasImageKitUploadConfig();
  const serverUploadFallbackEnabled = !process.env.VERCEL;

  return (
    <main className="admin-page min-h-screen" style={{ background: '#141300', color: '#FFFFFF', padding: '34px' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <AdminHeader />

        {message ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.4)', background: 'rgba(215,166,72,0.12)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            {message}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="font-body" style={{ border: '1px solid rgba(215,166,72,0.55)', background: 'rgba(215,166,72,0.16)', borderRadius: '6px', padding: '12px', marginBottom: '22px' }}>
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col" style={{ gap: '28px' }}>
          <Section title="Global SEO" intro="Controls the default title, description, and share image used by the site layout.">
            <UploadAwareForm action={saveGlobalSeoAction} clientUploadsEnabled={clientUploadsEnabled} serverUploadFallbackEnabled={serverUploadFallbackEnabled} className="flex flex-col" style={{ gap: '16px' }}>
              <input type="hidden" name="openGraphImageStorage" value={data.seo.openGraphImageStorage ? JSON.stringify(data.seo.openGraphImageStorage) : ''} />
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="SEO title">
                  <input name="seoTitle" defaultValue={data.seo.title} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Open Graph image URL">
                  <input name="openGraphImage" defaultValue={data.seo.openGraphImage} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Upload Open Graph image">
                  <input name="seoOpenGraphFile" type="file" accept="image/*" className="font-body" style={fileInputStyle} />
                </Field>
                <Field label="Open Graph image alt">
                  <input name="openGraphImageAlt" defaultValue={data.seo.openGraphImageAlt} className="font-body" style={inputStyle} />
                </Field>
                <Field label="SEO description">
                  <textarea name="seoDescription" defaultValue={data.seo.description} className="font-body" style={textAreaStyle} />
                </Field>
                <div>
                  <p className="font-body" style={{ color: '#D7A648', fontSize: '13px', marginBottom: '8px' }}>Current share image</p>
                  <PreviewImage src={data.seo.openGraphImage} alt={data.seo.openGraphImageAlt} />
                </div>
              </div>
              <SubmitButton pendingLabel="Saving SEO..." className="font-heading" style={{ height: '46px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '17px', cursor: 'pointer' }}>
                Save SEO
              </SubmitButton>
            </UploadAwareForm>
          </Section>

          <Section title="Partner / Top Brand Logos" intro="Add, remove, reorder, or hide partner logos and text-only brand cards from the homepage brand strip.">
            <UploadAwareForm action={saveBrandsAction} clientUploadsEnabled={clientUploadsEnabled} serverUploadFallbackEnabled={serverUploadFallbackEnabled} className="flex flex-col" style={{ gap: '16px' }}>
              <Field label="Section heading">
                <input name="brandsTitle" defaultValue={data.brands.title} className="font-body" style={inputStyle} />
              </Field>
              <BrandRows items={data.brands.items} />
              <SubmitButton pendingLabel="Saving brands..." className="font-heading" style={{ height: '46px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '17px', cursor: 'pointer' }}>
                Save Brands
              </SubmitButton>
            </UploadAwareForm>
          </Section>

          <Section title="About Page" intro="Controls about page hero copy, studio photo/year cards, mission copy, value cards, and timeline rows.">
            <UploadAwareForm action={saveAboutAction} clientUploadsEnabled={clientUploadsEnabled} serverUploadFallbackEnabled={serverUploadFallbackEnabled} className="flex flex-col" style={{ gap: '20px' }}>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Hero label">
                  <input name="heroLabel" defaultValue={data.about.hero.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Hero heading" hint="Use a new line where the design should break the heading.">
                  <textarea name="heroHeading" defaultValue={data.about.hero.heading} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Hero subtitle">
                  <textarea name="heroSubtitle" defaultValue={data.about.hero.subtitle} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="About stats" hint="One per line: value|label">
                  <textarea name="aboutStatsLines" defaultValue={formatStats(data.about.stats)} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Hero primary CTA label">
                  <input name="heroPrimaryCtaLabel" defaultValue={data.about.hero.primaryCtaLabel} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Hero primary CTA link">
                  <input name="heroPrimaryCtaHref" defaultValue={data.about.hero.primaryCtaHref} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Hero secondary CTA label">
                  <input name="heroSecondaryCtaLabel" defaultValue={data.about.hero.secondaryCtaLabel} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Hero secondary CTA link">
                  <input name="heroSecondaryCtaHref" defaultValue={data.about.hero.secondaryCtaHref} className="font-body" style={inputStyle} />
                </Field>
              </div>

              <div>
                <h3 className="font-heading" style={{ fontSize: '24px', color: '#FFFFFF', marginBottom: '12px' }}>Studio Cards</h3>
                <StudioRows items={data.about.studios} />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Mission label">
                  <input name="missionLabel" defaultValue={data.about.mission.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Mission heading">
                  <textarea name="missionHeading" defaultValue={data.about.mission.heading} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Mission body">
                  <textarea name="missionBody" defaultValue={data.about.mission.body} className="font-body" style={{ ...textAreaStyle, minHeight: '180px' }} />
                </Field>
                <Field label="Mission quote">
                  <textarea name="missionQuote" defaultValue={data.about.mission.quote} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Mission quote attribution">
                  <input name="missionQuoteAttribution" defaultValue={data.about.mission.quoteAttribution} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Mission primary CTA label">
                  <input name="missionPrimaryCtaLabel" defaultValue={data.about.mission.primaryCtaLabel} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Mission primary CTA link">
                  <input name="missionPrimaryCtaHref" defaultValue={data.about.mission.primaryCtaHref} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Mission secondary CTA label">
                  <input name="missionSecondaryCtaLabel" defaultValue={data.about.mission.secondaryCtaLabel} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Mission secondary CTA link">
                  <input name="missionSecondaryCtaHref" defaultValue={data.about.mission.secondaryCtaHref} className="font-body" style={inputStyle} />
                </Field>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Team label">
                  <input name="teamLabel" defaultValue={data.about.teamIntro.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Team heading">
                  <textarea name="teamHeading" defaultValue={data.about.teamIntro.heading} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Team subtitle">
                  <textarea name="teamSubtitle" defaultValue={data.about.teamIntro.subtitle} className="font-body" style={textAreaStyle} />
                </Field>
              </div>

              <div>
                <h3 className="font-heading" style={{ fontSize: '24px', color: '#FFFFFF', marginBottom: '12px' }}>Team Cards</h3>
                <TeamRows items={data.about.teamMembers} />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Values label">
                  <input name="valuesLabel" defaultValue={data.about.valuesIntro.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Values heading">
                  <textarea name="valuesHeading" defaultValue={data.about.valuesIntro.heading} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Values subtitle">
                  <textarea name="valuesSubtitle" defaultValue={data.about.valuesIntro.subtitle} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Value cards" hint="One per line: num|title|description">
                  <textarea name="aboutValuesLines" defaultValue={formatValues(data.about.values)} className="font-body" style={{ ...textAreaStyle, minHeight: '180px' }} />
                </Field>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Timeline label">
                  <input name="timelineLabel" defaultValue={data.about.timelineIntro.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Timeline heading">
                  <textarea name="timelineHeading" defaultValue={data.about.timelineIntro.heading} className="font-body" style={textAreaStyle} />
                </Field>
              </div>
              <TimelineRows items={data.about.timeline} />

              <SubmitButton pendingLabel="Saving about..." className="font-heading" style={{ height: '46px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '17px', cursor: 'pointer' }}>
                Save About Page
              </SubmitButton>
            </UploadAwareForm>
          </Section>

          <Section title="Terms & Policy" intro="Edit the legal page heading, company identifiers, and policy sections.">
            <form action={saveLegalAction} className="flex flex-col" style={{ gap: '16px' }}>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Page label">
                  <input name="legalLabel" defaultValue={data.legal.label} className="font-body" style={inputStyle} />
                </Field>
                <Field label="Page heading">
                  <textarea name="legalHeading" defaultValue={data.legal.heading} className="font-body" style={textAreaStyle} />
                </Field>
                <Field label="Company name">
                  <input name="legalCompanyName" defaultValue={data.legal.companyName} className="font-body" style={inputStyle} />
                </Field>
                <Field label="GST number">
                  <input name="legalGstNumber" defaultValue={data.legal.gstNumber} className="font-body" style={inputStyle} />
                </Field>
              </div>
              <LegalRows items={data.legal.sections} />
              <SubmitButton pendingLabel="Saving legal..." className="font-heading" style={{ height: '46px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '17px', cursor: 'pointer' }}>
                Save Terms & Policy
              </SubmitButton>
            </form>
          </Section>
        </div>
      </div>
    </main>
  );
}

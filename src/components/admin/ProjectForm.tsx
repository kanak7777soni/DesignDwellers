/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import AdminMediaRows from '@/components/admin/AdminMediaRows';
import type { PortfolioCategory, PortfolioProject, ProjectMedia } from '@/lib/portfolio';
import { formatList, formatStats } from '@/lib/portfolio-store';

type ProjectFormProps = {
  project?: PortfolioProject;
  categories: PortfolioCategory[];
  action: (formData: FormData) => Promise<void>;
};

const inputStyle = {
  height: '42px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '0 12px',
  outline: 'none',
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

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px' }}>
      {label}
      {children}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ border: '1px solid rgba(215,166,72,0.25)', padding: '24px', borderRadius: '8px', background: '#000000' }}>
      <h2 className="font-heading" style={{ fontSize: '28px', color: '#FFFFFF', marginBottom: '18px' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function MediaPreview({ media }: { media?: ProjectMedia }) {
  if (!media?.src) {
    return (
      <div className="font-body flex items-center justify-center" style={{ width: '88px', height: '64px', borderRadius: '6px', background: '#141300', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
        Empty
      </div>
    );
  }

  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        poster={media.poster}
        muted
        playsInline
        style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
      />
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt}
      style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
    />
  );
}


export default function ProjectForm({ project, categories, action }: ProjectFormProps) {
  const categorySlugs = project?.categorySlugs || [];
  const primaryCategorySlug = project?.primaryCategorySlug || categories[0]?.slug || '';
  const meta = project?.meta || {};
  const seo = project?.seo || {};

  return (
    <form action={action} encType="multipart/form-data" className="flex flex-col" style={{ gap: '24px' }}>
      <input type="hidden" name="id" value={project?.id || ''} />

      <Section title="Project Details">
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          <Field label="Project name">
            <input name="name" defaultValue={project?.name || ''} required className="font-body" style={inputStyle} />
          </Field>
          <Field label="URL slug">
            <input name="slug" defaultValue={project?.slug || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Card details shown publicly">
            <input name="details" defaultValue={project?.details || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Primary category">
            <select name="primaryCategorySlug" defaultValue={primaryCategorySlug} className="font-body" style={inputStyle}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Portfolio order">
            <input name="portfolioOrder" type="number" defaultValue={project?.portfolioOrder ?? ''} className="font-body number-input-clean" style={inputStyle} />
          </Field>
          <Field label="Featured order">
            <input name="featuredOrder" type="number" defaultValue={project?.featuredOrder ?? ''} className="font-body number-input-clean" style={inputStyle} />
          </Field>
        </div>

        <div className="flex flex-wrap" style={{ gap: '14px', marginTop: '18px' }}>
          <label className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
            <input type="checkbox" name="published" defaultChecked={project?.published ?? true} />
            Published
          </label>
          <label className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
            <input type="checkbox" name="isFeatured" defaultChecked={typeof project?.featuredOrder === 'number'} />
            Featured on home page
          </label>
        </div>

        <div style={{ marginTop: '18px' }}>
          <p className="font-body" style={{ color: '#D7A648', fontSize: '13px', marginBottom: '10px' }}>
            Categories
          </p>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {categories.map((category) => (
              <label key={category.slug} className="font-body flex items-center" style={{ gap: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="categorySlugs"
                  value={category.slug}
                  defaultChecked={categorySlugs.includes(category.slug) || category.slug === primaryCategorySlug}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Interior Details">
        <div className="grid grid-cols-3" style={{ gap: '16px' }}>
          <Field label="Project type">
            <input name="projectType" defaultValue={meta.projectType || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Location">
            <input name="location" defaultValue={meta.location || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="City">
            <input name="city" defaultValue={meta.city || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Area">
            <input name="area" defaultValue={meta.area || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Duration">
            <input name="duration" defaultValue={meta.duration || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Budget">
            <input name="budget" defaultValue={meta.budget || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Year">
            <input name="year" defaultValue={meta.year || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Style">
            <input name="style" defaultValue={meta.style || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Services used">
            <textarea name="services" defaultValue={formatList(meta.services)} className="font-body" style={{ ...textAreaStyle, minHeight: '88px' }} />
          </Field>
          <Field label="Materials and finishes">
            <textarea name="materials" defaultValue={formatList(meta.materials)} className="font-body" style={{ ...textAreaStyle, minHeight: '88px' }} />
          </Field>
          <Field label="Client brief">
            <textarea name="clientBrief" defaultValue={meta.clientBrief || ''} className="font-body" style={{ ...textAreaStyle, minHeight: '88px' }} />
          </Field>
        </div>
      </Section>

      <Section title="Card Media">
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          <div>
            <p className="font-body" style={{ color: '#D7A648', fontSize: '13px', marginBottom: '8px' }}>Current card media</p>
            <MediaPreview media={project?.cardMedia} />
          </div>
          <Field label="Upload card image/video">
            <input name="cardFile" type="file" accept="image/*,video/*" className="font-body" style={{ ...inputStyle, paddingTop: '9px' }} />
          </Field>
          <Field label="Card media type">
            <select name="cardType" defaultValue={project?.cardMedia.type || 'image'} className="font-body" style={inputStyle}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="Card media URL">
            <input name="cardSrc" defaultValue={project?.cardMedia.src || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Card alt text">
            <input name="cardAlt" defaultValue={project?.cardMedia.alt || ''} className="font-body" style={inputStyle} />
          </Field>
          <div>
            <p className="font-body" style={{ color: '#D7A648', fontSize: '13px', marginBottom: '8px' }}>Current home featured media</p>
            <MediaPreview media={project?.featuredMedia} />
            {project?.featuredMedia ? (
              <label className="font-body flex items-center" style={{ gap: '7px', color: '#FFFFFF', fontSize: '13px', marginTop: '10px' }}>
                <input type="checkbox" name="removeFeaturedMedia" />
                Remove featured media
              </label>
            ) : null}
          </div>
          <Field label="Home featured media URL">
            <input name="featuredSrc" defaultValue={project?.featuredMedia?.src || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="Upload home featured media">
            <input name="featuredFile" type="file" accept="image/*,video/*" className="font-body" style={{ ...inputStyle, paddingTop: '9px' }} />
          </Field>
          <Field label="Home featured alt text">
            <input name="featuredAlt" defaultValue={project?.featuredMedia?.alt || ''} className="font-body" style={inputStyle} />
          </Field>
        </div>
      </Section>

      <Section title="Project Page">
        <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '22px' }}>
          <Field label="Stats, one per line: value|label">
            <textarea name="statsLines" defaultValue={formatStats(project?.detail.stats || [])} className="font-body" style={textAreaStyle} />
          </Field>
          <Field label="Description">
            <textarea name="description" defaultValue={project?.detail.description || ''} className="font-body" style={textAreaStyle} />
          </Field>
        </div>
        <div className="flex flex-col" style={{ gap: '22px' }}>
          <div>
            <h3 className="font-heading" style={{ color: '#FFFFFF', fontSize: '22px', marginBottom: '12px' }}>Hero Media</h3>
            <AdminMediaRows name="heroMedia" label="Hero media" media={project?.detail.heroMedia || []} uploadName="heroFiles" blankRows={2} />
          </div>
          <div>
            <h3 className="font-heading" style={{ color: '#FFFFFF', fontSize: '22px', marginBottom: '12px' }}>Gallery Media</h3>
            <AdminMediaRows name="galleryMedia" label="Gallery media" media={project?.detail.galleryMedia || []} uploadName="galleryFiles" blankRows={6} />
          </div>
        </div>
      </Section>

      <Section title="SEO">
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          <Field label="SEO title">
            <input name="seoTitle" defaultValue={seo.title || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="SEO image URL">
            <input name="seoImage" defaultValue={seo.image || ''} className="font-body" style={inputStyle} />
          </Field>
          <Field label="SEO description">
            <textarea name="seoDescription" defaultValue={seo.description || ''} className="font-body" style={textAreaStyle} />
          </Field>
        </div>
      </Section>

      <button
        type="submit"
        className="font-heading"
        style={{ height: '48px', borderRadius: '55px', border: 'none', background: '#D7A648', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
      >
        Save Project
      </button>
    </form>
  );
}

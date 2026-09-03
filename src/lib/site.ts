/**
 * The one place the config is read and given a shape.
 *
 * Every page imports from here rather than reaching into the JSON, so that a
 * missing key fails in one place with a sentence rather than rendering
 * "undefined" into somebody's homepage.
 */

import config from '../../site.config.json';

export type Cta = { label: string; href: string };

export type Section =
  | { type: 'hero'; heading: string; text?: string | null; cta?: Cta | null; image?: string | null }
  | { type: 'text'; id?: string; heading?: string | null; body: string[] }
  | { type: 'cards'; id?: string; heading?: string | null; items: { title: string; text?: string; href?: string }[] }
  | { type: 'gallery'; id?: string; heading?: string | null; images: { src: string; alt: string }[] }
  | { type: 'cta'; heading: string; text?: string | null; cta?: Cta | null };

export type Site = {
  name: string;
  tagline?: string | null;
  domain?: string | null;
  description?: string | null;
  brand: { accent: string; font?: string | null };
  nav: { label: string; href: string }[];
  sections: Section[];
  contact: {
    blurb?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    hours?: string | null;
  };
  legal: { privacy: boolean; terms: boolean };
};

export const site = config.site as Site;

/** The intake, for reference while building. Never rendered. */
export const brief = (config as Record<string, unknown>).brief ?? {};

if (!site?.name) {
  throw new Error('site.config.json has no site.name. The build cannot proceed without it.');
}

/** Absolute URL for canonical links and Open Graph tags. */
export function url(path = '/'): string {
  const base = site.domain ? `https://${site.domain}` : '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** A telephone number as a `tel:` URI — digits and a leading + only. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

/**
 * Structured data so the business can be understood by a search engine rather
 * than merely indexed. Only the fields that were actually answered go in —
 * inventing an address to satisfy a schema is how a business ends up listed at
 * a place it has never been.
 */
export function localBusinessJsonLd(): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    url: url('/'),
  };
  if (site.description) data.description = site.description;
  if (site.contact.phone) data.telephone = site.contact.phone;
  if (site.contact.email) data.email = site.contact.email;
  if (site.contact.address) data.address = site.contact.address;
  if (site.contact.hours) data.openingHours = site.contact.hours;
  return JSON.stringify(data);
}

import { useEffect } from "react";

interface PageMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

function setMetaTag(name: string, content: string, attribute: string = "name") {
  let element = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let element = document.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
}) => {
  useEffect(() => {
    const previousTitle = document.title;

    if (title) {
      document.title = `${title} | RealEstate AI`;
    }

    if (description) {
      setMetaTag("description", description);
      setMetaTag("og:description", description, "property");
      setMetaTag("twitter:description", description, "name");
    }

    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    if (canonicalUrl) {
      setLinkTag("canonical", canonicalUrl);
    }

    if (title) {
      setMetaTag("og:title", `${title} | RealEstate AI`, "property");
      setMetaTag("twitter:title", `${title} | RealEstate AI`, "name");
    }

    if (ogImage) {
      setMetaTag("og:image", ogImage, "property");
      setMetaTag("twitter:image", ogImage, "name");
      setMetaTag("twitter:card", "summary_large_image", "name");
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null;
};

export default PageMeta;

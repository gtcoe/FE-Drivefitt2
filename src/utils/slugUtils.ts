/**
 * Utility functions for handling blog slugs
 */

/**
 * Generate a URL-friendly slug from a title
 * @param title - The blog title
 * @returns A URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      // Replace multiple spaces/hyphens with single hyphen
      .replace(/[\s-]+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Limit length to 100 characters
      .substring(0, 100)
      // Remove trailing hyphen if substring cut in the middle
      .replace(/-+$/, "")
  );
};

/**
 * Validate if a slug is properly formatted
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export const validateSlug = (slug: string): boolean => {
  // Check if slug matches the expected pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  return (
    slug.length > 0 &&
    slug.length <= 100 &&
    slugPattern.test(slug) &&
    !slug.startsWith("-") &&
    !slug.endsWith("-")
  );
};

/**
 * Sanitize a slug to ensure it's valid
 * @param slug - The slug to sanitize
 * @returns A sanitized slug
 */
export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100)
    .replace(/-+$/, "");
};

/**
 * Check if a slug is unique (would need to be called with API)
 * @param slug - The slug to check
 * @param excludeId - Optional blog ID to exclude from uniqueness check
 * @returns Promise<boolean> - True if unique, false if already exists
 */
export const checkSlugUniqueness = async (
  slug: string,
  excludeId?: string | number
): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    if (excludeId) {
      params.append("exclude", String(excludeId));
    }

    const response = await fetch(
      `/api/blogs/check-slug/${slug}?${params.toString()}`
    );

    if (!response.ok) {
      return false;
    }

    const { data } = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

/**
 * Generate a unique slug by appending numbers if necessary
 * @param baseSlug - The base slug to make unique
 * @param excludeId - Optional blog ID to exclude from uniqueness check
 * @returns Promise<string> - A unique slug
 */
export const generateUniqueSlug = async (
  baseSlug: string,
  excludeId?: string | number
): Promise<string> => {
  const slug = sanitizeSlug(baseSlug);
  let counter = 1;

  // Check if base slug is unique
  if (await checkSlugUniqueness(slug, excludeId)) {
    return slug;
  }

  // If not unique, try appending numbers
  while (counter <= 100) {
    // Prevent infinite loop
    const numberedSlug = `${slug}-${counter}`;
    if (await checkSlugUniqueness(numberedSlug, excludeId)) {
      return numberedSlug;
    }
    counter++;
  }

  // Fallback: append timestamp
  return `${slug}-${Date.now()}`;
};

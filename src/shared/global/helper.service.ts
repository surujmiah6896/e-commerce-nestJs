import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  /**
   * Generate a URL-friendly slug from any text
   * @param text - The text to convert to slug
   * @returns Generated slug
   */
  generateSlug(text: string): string {
    if (!text) return '';

    return text
      .toString()
      .normalize('NFKD') // Normalize Unicode characters
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from both ends
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters except hyphens
      .replace(/\-\-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+/, '') // Trim hyphens from start
      .replace(/-+$/, ''); // Trim hyphens from end
  }

  /**
   * Generate slug and ensure uniqueness
   * @param baseText - Base text for slug
   * @param existingSlugs - Array of existing slugs to check against
   * @returns Unique slug
   */
  generateUniqueSlug(baseText: string, existingSlugs: string[]): string {
    const baseSlug = this.generateSlug(baseText);

    // If base slug is not in existing slugs, return it
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    // Otherwise, append numbers until we find a unique slug
    let counter = 1;
    let slug = `${baseSlug}-${counter}`;

    while (existingSlugs.includes(slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  /**
   * Generate slug with timestamp for uniqueness
   * @param text - Base text
   * @returns Slug with timestamp
   */
  generateSlugWithTimestamp(text: string): string {
    const baseSlug = this.generateSlug(text);
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    return `${baseSlug}-${timestamp}`;
  }

  /**
   * Generate slug with custom suffix
   * @param text - Base text
   * @param suffix - Custom suffix (could be ID, username, etc.)
   * @returns Slug with suffix
   */
  generateSlugWithSuffix(text: string, suffix: string): string {
    const baseSlug = this.generateSlug(text);
    const cleanSuffix = this.generateSlug(suffix);
    return `${baseSlug}-${cleanSuffix}`;
  }

  /**
   * Check if a slug is valid
   * @param slug - Slug to validate
   * @returns Boolean indicating if slug is valid
   */
  isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }
}

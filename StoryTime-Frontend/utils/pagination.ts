export interface PaginationOptions {
  wordsPerPage?: number;
  estimatedWordsPerMinute?: number;
}

export function paginateContent(
  content: string, 
  options: PaginationOptions = {}
): string[] {
  const { wordsPerPage = 250 } = options;
  
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Split content into paragraphs first
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const pages: string[] = [];
  let currentPage = '';
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/).length;
    
    // If adding this paragraph would exceed the word limit
    if (currentWordCount + paragraphWords > wordsPerPage && currentPage.trim().length > 0) {
      // Save current page and start a new one
      pages.push(currentPage.trim());
      currentPage = paragraph + '\n\n';
      currentWordCount = paragraphWords;
    } else {
      // Add paragraph to current page
      currentPage += paragraph + '\n\n';
      currentWordCount += paragraphWords;
    }
  }

  // Add the last page if it has content
  if (currentPage.trim().length > 0) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [content];
}

export function estimateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
export const generateSKU = (categoryName?: string) => {
  if (!categoryName) return "";
  const uuid = crypto.randomUUID();
  const prefix = categoryName
    .trim()
    .split(/\s+/) // split by one or more spaces
    .map((word) => word[0]) // take first letter of each word
    .join("")
    .toUpperCase();
  return `${prefix}-${uuid}`;
};

export const generateSlugFromProductVietnameseName = (productName: string) => {
  return productName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
};

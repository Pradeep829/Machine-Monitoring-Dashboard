// Utility function to convert machine name to URL-friendly slug
export const nameToSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
};

// Utility function to convert slug back to name (for display)
// Note: This is approximate since we can't perfectly reverse the slug
// The actual lookup should be done by matching the slug with the name
export const slugToName = (slug) => {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export function isAfterStartDate(dateStr, startDate) {
    return new Date(dateStr) >= new Date(startDate);
}

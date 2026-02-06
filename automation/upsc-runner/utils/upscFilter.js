export function isRealUPSCRecruitment(extracted) {

    if (!extracted?.rawText) return false;

    const text = extracted.rawText.toLowerCase();

    const strong = [
        "recruitment",
        "vacancy",
        "vacancies",
        "posts",
        "applications are invited",
        "application are invited",
        "recruitment to the posts",
        "appointment to the post",
        "candidates are invited"
    ];

    const reject = [
        "result",
        "answer key",
        "interview list",
        "exam schedule",
        "time table",
        "timetable",
        "syllabus",
        "tender",
        "corrigendum",
        "notice regarding"
    ];

    const hasStrong = strong.some(w => text.includes(w));
    const hasReject = reject.some(w => text.includes(w));

    return hasStrong && !hasReject;
}
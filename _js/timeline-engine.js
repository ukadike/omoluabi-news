/**
 * Temporal integrity layer. Sorts a story's events chronologically and
 * flags any entry that is out of order relative to its stated date —
 * a cheap signal that an account may need a second look.
 */

class TimelineEngine {
  constructor(events = []) {
    this.events = [...events].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  validateTimeline() {
    const issues = [];
    for (let i = 0; i < this.events.length - 1; i++) {
      if (new Date(this.events[i].date) > new Date(this.events[i + 1].date)) {
        issues.push({
          before: this.events[i],
          after: this.events[i + 1],
          issue: "Chronological inconsistency",
        });
      }
    }
    return issues;
  }

  render(container) {
    if (!container) return;
    const items = this.events
      .map(
        (event) => `
      <li class="timeline-item">
        <span class="timeline-marker" aria-hidden="true"></span>
        <time datetime="${event.date}">${event.date}</time>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
      </li>`
      )
      .join("");
    // No id on this <ol> — the caller's container element already carries
    // id="timeline-container"; duplicating it here would create two
    // elements sharing one id (WCAG 4.1.1 parsing / broken id references).
    container.innerHTML = `<ol style="list-style: none; padding: 0; margin: 0;">${items}</ol>`;
  }
}

if (typeof window !== "undefined") {
  window.TimelineEngine = TimelineEngine;
}

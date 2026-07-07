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
        <h4>${event.title}</h4>
        <p>${event.description}</p>
      </li>`
      )
      .join("");
    container.innerHTML = `<ol id="timeline-container" style="list-style: none; padding: 0; margin: 0;">${items}</ol>`;
  }
}

if (typeof window !== "undefined") {
  window.TimelineEngine = TimelineEngine;
}

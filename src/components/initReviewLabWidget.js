const REVIEW_LAB_SCRIPT_SRC = "https://app.reviewlab.ru/widget/index-es2015.js";

function loadReviewLabWidget() {
  const existingScript = document.querySelector(`script[src="${REVIEW_LAB_SCRIPT_SRC}"]`);

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.src = REVIEW_LAB_SCRIPT_SRC;
  script.async = true;

  document.body.appendChild(script);
}

export function initReviewLabWidget() {
  const widget = document.querySelector("review-lab[data-widgetid]");
  const section = widget?.closest("section");

  if (!widget || !section) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    loadReviewLabWidget();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      loadReviewLabWidget();
      observer.disconnect();
    },
    { rootMargin: "500px 0px", threshold: 0.01 },
  );

  observer.observe(section);
}

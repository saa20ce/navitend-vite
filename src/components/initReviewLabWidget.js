const REVIEW_LAB_SCRIPT_SRC = "https://app.reviewlab.ru/widget/index-es2015.js";

export function initReviewLabWidget() {
  const widget = document.querySelector("review-lab[data-widgetid]");

  if (!widget) {
    return;
  }

  const existingScript = document.querySelector(`script[src="${REVIEW_LAB_SCRIPT_SRC}"]`);

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.src = REVIEW_LAB_SCRIPT_SRC;
  script.defer = true;

  document.body.appendChild(script);
}

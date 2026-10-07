export const licenses = [
  {
    id: "license-1",
    src: "./assets/docs/1lic.png",
    width: 2380,
    height: 3425,
    alt: "Лицензия на медицинскую деятельность, страница 1",
  },
  {
    id: "license-2",
    src: "./assets/docs/2lic.png",
    width: 2339,
    height: 3365,
    alt: "Лицензия на медицинскую деятельность, страница 2",
  },
  {
    id: "license-3",
    src: "./assets/docs/3lic.png",
    width: 2293,
    height: 3353,
    alt: "Лицензия на медицинскую деятельность, приложение",
  },
  {
    id: "license-4",
    src: "./assets/docs/4lic.png",
    width: 2357,
    height: 3377,
    alt: "Свидетельство, документ 4",
  },
  {
    id: "license-5",
    src: "./assets/docs/5lic.png",
    width: 2355,
    height: 3401,
    alt: "Свидетельство, документ 5",
  },
  {
    id: "license-6",
    src: "./assets/docs/6lic.png",
    width: 2375,
    height: 3393,
    alt: "Свидетельство, документ 6",
  },
].map((license) => ({
  ...license,
  // Keep the full-resolution scan as the link target, not the slider image.
  previewSrc: license.src.replace(/\.png$/, "-640.webp"),
  previewSrcSet: [640, 1280]
    .map((width) => `${license.src.replace(/\.png$/, `-${width}.webp`)} ${width}w`)
    .join(", "),
}));

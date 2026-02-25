/**
 * 投票系統設定
 * - ALLOWED_DOMAIN: 有填 email 時只允許此網域結尾
 * - FORM: Google 表單 ID 與各題 entry id，詳見 docs/GOOGLE_FORM_SETUP.md
 */

/** 有填 email 時只允許此網域結尾，例如 "@company.com" */
export const ALLOWED_DOMAIN = "@91app.com";
// https://docs.google.com/forms/d/e/1FAIpQLSeyhoE0BjxHrTKXv7RPnoqDiph0j7umht2pOyQpxaQfFE8C0A/viewform?usp=publish-editor
export const FORM = {
  id: "1FAIpQLSeyhoE0BjxHrTKXv7RPnoqDiph0j7umht2pOyQpxaQfFE8C0A",
  action: (id: string) => `https://docs.google.com/forms/d/e/${id}/formResponse`,
  entry: {
    email: "entry.2142414227",
    employeeId: "entry.1457012871",
    award1_1: "entry.1978989609",
    award1_2: "entry.1421180337",
    award1_3: "entry.1485903155",
    award2_1: "entry.1745000233",
    award2_2: "entry.141170087",
    award2_3: "entry.1062234556",
    award3_1: "entry.1554551921",
    award3_2: "entry.901023993",
    award3_3: "entry.853605714",
    award4_1: "entry.742262175",
    award4_2: "entry.606601641",
    award4_3: "entry.1662071519",
    award5_1: "entry.86910676",
    award5_2: "entry.913931253",
    award5_3: "entry.720085221",
    award6_1: "entry.196551519",
    award6_2: "entry.1394220244",
    award6_3: "entry.1857810688",
  },
} as const;

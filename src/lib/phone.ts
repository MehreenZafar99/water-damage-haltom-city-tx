import siteConfig from "../../site.config";

export function applyPhone(text: string): string {
  return text
    .replaceAll(siteConfig.phonePlaceholder, siteConfig.phoneDisplay)
    .replaceAll("(817) XXX-XXXX", siteConfig.phoneDisplay)
    .replaceAll("+1817XXXXXXX", siteConfig.phoneTel);
}

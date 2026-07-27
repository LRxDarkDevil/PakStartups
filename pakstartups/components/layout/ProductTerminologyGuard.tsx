"use client";

import { useEffect } from "react";

const EXACT_RENAMES: Record<string, string> = {
  "Find Co-Founder": "Co Founder Matcher",
  "Find a Co-Founder": "Co Founder Matcher",
  "Find Your Co-Founder": "Co Founder Matcher",
  "Co-Founder Matching": "Co Founder Matcher",
  "Co-Founder Matchmaking": "Co Founder Matcher",
  "Co-Founder Matchmaking Engine": "Co Founder Matcher",
};

const SKIPPED_PARENTS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
const ATTRIBUTES = ["aria-label", "title", "placeholder"] as const;

function renameTextNode(node: Text) {
  if (node.parentElement && SKIPPED_PARENTS.has(node.parentElement.tagName)) return;

  const raw = node.nodeValue ?? "";
  const trimmed = raw.trim();
  const replacement = EXACT_RENAMES[trimmed];
  if (!replacement) return;

  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  node.nodeValue = `${leading}${replacement}${trailing}`;
}

function normalizeElement(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    renameTextNode(current as Text);
    current = walker.nextNode();
  }

  if (root instanceof Element) {
    [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))].forEach((element) => {
      ATTRIBUTES.forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && EXACT_RENAMES[value]) element.setAttribute(attribute, EXACT_RENAMES[value]);
      });
    });
  }
}

export default function ProductTerminologyGuard() {
  useEffect(() => {
    normalizeElement(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData" && mutation.target instanceof Text) {
          renameTextNode(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof Text) renameTextNode(node);
          else if (node instanceof Element) normalizeElement(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

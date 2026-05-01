import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings2, X } from "lucide-react";

const STORAGE_KEY = "codelyne_cookie_consent_v1";
const EVENT_NAME = "codelyne:consent-change";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export type ConsentRecord = {
  categories: ConsentCategories;
  timestamp: string;
  version: 1;
};

export const DEFAULT_REJECTED: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

const ALL_ACCEPTED: ConsentCategories = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

export function getStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (!parsed?.categories || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsent(category: keyof ConsentCategories): boolean {
  const stored = getStoredConsent();
  return Boolean(stored?.categories?.[category]);
}

function persistConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    categories,
    timestamp: new Date().toISOString(),
    version: 1,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* ignore storage errors */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ConsentRecord>(EVENT_NAME, { detail: record }),
    );
  }
  return record;
}

export function CookieConsent() {
  const [stored, setStored] = useState<ConsentRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(DEFAULT_REJECTED);

  useEffect(() => {
    const existing = getStoredConsent();
    setStored(existing);
    if (!existing) {
      setOpen(true);
      setDraft(DEFAULT_REJECTED);
    }
  }, []);

  useEffect(() => {
    function handleOpen() {
      const existing = getStoredConsent();
      setDraft(existing?.categories ?? DEFAULT_REJECTED);
      setShowCustomize(true);
      setOpen(true);
    }
    window.addEventListener("codelyne:open-cookie-settings", handleOpen);
    return () =>
      window.removeEventListener(
        "codelyne:open-cookie-settings",
        handleOpen,
      );
  }, []);

  const finalize = useCallback((categories: ConsentCategories) => {
    const record = persistConsent(categories);
    setStored(record);
    setOpen(false);
    setShowCustomize(false);
  }, []);

  const acceptAll = () => finalize(ALL_ACCEPTED);
  const rejectAll = () => finalize(DEFAULT_REJECTED);
  const saveCustom = () => finalize({ ...draft, necessary: true });

  const categoryDefs = useMemo(
    () => [
      {
        key: "necessary" as const,
        label: "Strictly necessary",
        description:
          "Required for core site functionality such as authentication, security and form submission. Cannot be disabled.",
        locked: true,
      },
      {
        key: "analytics" as const,
        label: "Analytics",
        description:
          "Helps us understand how visitors use the site so we can improve it (e.g. Google Analytics).",
        locked: false,
      },
      {
        key: "marketing" as const,
        label: "Marketing",
        description:
          "Used to deliver relevant ads and measure the effectiveness of campaigns.",
        locked: false,
      },
      {
        key: "preferences" as const,
        label: "Preferences",
        description:
          "Remember choices like language or region to personalise your experience.",
        locked: false,
      },
    ],
    [],
  );

  if (stored && !open) return null;
  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      data-testid="cookie-consent"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0b0f19]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h2
                id="cookie-consent-title"
                className="text-base sm:text-lg font-heading font-semibold text-white"
              >
                We value your privacy
              </h2>
              {stored && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white -mt-1 -mr-1 p-1 rounded"
                  aria-label="Close cookie settings"
                  data-testid="button-cookie-close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-300 leading-relaxed">
              We use cookies to keep the site secure, analyse traffic and improve
              your experience. You can accept all, reject non-essential, or
              customise your choices. Compliant with DPDPA (India) and GDPR (EU).
            </p>

            {showCustomize && (
              <div
                className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1"
                data-testid="cookie-customize-panel"
              >
                {categoryDefs.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {c.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.description}
                      </p>
                    </div>
                    <Switch
                      checked={draft[c.key]}
                      disabled={c.locked}
                      onCheckedChange={(checked) =>
                        setDraft((prev) => ({
                          ...prev,
                          [c.key]: c.locked ? true : Boolean(checked),
                        }))
                      }
                      aria-label={`Toggle ${c.label}`}
                      data-testid={`switch-cookie-${c.key}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              {!showCustomize ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                  onClick={() => {
                    setDraft(stored?.categories ?? DEFAULT_REJECTED);
                    setShowCustomize(true);
                  }}
                  data-testid="button-cookie-customize"
                >
                  <Settings2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Customize
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                  onClick={() => setShowCustomize(false)}
                  data-testid="button-cookie-back"
                >
                  Back
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={rejectAll}
                data-testid="button-cookie-reject"
              >
                Reject non-essential
              </Button>

              {showCustomize ? (
                <Button
                  type="button"
                  className="bg-primary text-background hover:bg-primary/90"
                  onClick={saveCustom}
                  data-testid="button-cookie-save"
                >
                  Save preferences
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-primary text-background hover:bg-primary/90"
                  onClick={acceptAll}
                  data-testid="button-cookie-accept-all"
                >
                  Accept all
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;

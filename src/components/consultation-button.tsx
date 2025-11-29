'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { PersonalInfo } from '@/lib/edge-config';

interface ConsultationButtonProps {
  personalInfo: PersonalInfo;
}

export function ConsultationButton({ personalInfo }: ConsultationButtonProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "consultation-1-1" });
      cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, []);

  const consultationLink = personalInfo.consultationLink;
  const buttonText = `Book Consultation • ${personalInfo.consultationPrice}`;

  return (
    <button
      data-cal-namespace="consultation-1-1"
      data-cal-link={consultationLink}
      data-cal-config='{"layout":"month_view"}'
      className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-gray-900/40 hover:scale-105 active:scale-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer transform"
    >
      {buttonText}
    </button>
  );
}

